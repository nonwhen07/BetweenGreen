// UI 計時集中於此；Redux 僅保存訊息，沒有 timer 或 DOM 狀態。
const DURATIONS = { success: 5000, info: 5000, warning: 7000, error: 7000 };
const MAX_VISIBLE = 3;
const MIN_RESUME = 2000;

export function createToastLifecycle({ onRemove, reducedMotion = () => false, clock = {
  now: () => performance.now(),
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timer) => clearTimeout(timer),
} }) {
  const records = new Map();
  const pinned = new Set();
  const pauseReasons = new Set();
  const listeners = new Set();
  let snapshot = { items: [], paused: false };
  let suspended = false;

  const emit = () => {
    snapshot = {
      items: Array.from(records.values(), ({ id, phase }) => ({ id, phase })),
      paused: pauseReasons.size > 0,
    };
    listeners.forEach((listener) => listener());
  };
  const stop = (record) => {
    if (record.timer === null) return;
    clock.clearTimeout(record.timer);
    record.remaining = Math.max(0, record.deadline - clock.now());
    record.timer = null;
  };
  const schedule = (record, callback) => {
    if (suspended || record.timer !== null) return;
    record.deadline = clock.now() + record.remaining;
    record.timer = clock.setTimeout(() => {
      record.timer = null;
      callback();
    }, record.remaining);
  };
  const forget = (id) => {
    const record = records.get(id);
    if (record) stop(record);
    records.delete(id);
    pinned.delete(id);
  };
  const finishExit = (id) => {
    if (records.get(id)?.phase !== 'exiting') return;
    forget(id);
    emit();
    onRemove(id);
  };
  const startReading = (record) => {
    if (!pinned.has(record.id) && !pauseReasons.size) {
      schedule(record, () => dismiss(record.id));
    }
  };
  const finishEntrance = (id) => {
    const record = records.get(id);
    if (!record || record.phase !== 'entering') return;
    stop(record);
    record.phase = 'visible';
    record.remaining = DURATIONS[record.status] ?? DURATIONS.info;
    startReading(record);
    emit();
  };
  const dismiss = (id) => {
    const record = records.get(id);
    if (!record || record.phase === 'exiting') return;
    if (record.phase === 'queued') {
      forget(id);
      emit();
      onRemove(id);
      return;
    }
    stop(record);
    record.phase = 'exiting';
    record.remaining = record.status === 'success' ? (reducedMotion() ? 100 : 180) : 300;
    schedule(record, () => finishExit(id));
    emit();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    sync(messages) {
      suspended = false;
      const ids = new Set(messages.map(({ id }) => id));
      Array.from(records.keys()).forEach((id) => { if (!ids.has(id)) forget(id); });
      Array.from(pinned).forEach((id) => { if (!ids.has(id)) pinned.delete(id); });
      messages.forEach(({ id, status }) => {
        if (!records.has(id)) records.set(id, { id, status, phase: 'queued', remaining: 0, timer: null });
      });
      let occupied = Array.from(records.values()).filter(({ phase }) => phase !== 'queued').length;
      for (const record of records.values()) {
        if (record.phase === 'queued' && occupied < MAX_VISIBLE) {
          record.phase = 'entering';
          record.remaining = record.status === 'success' ? (reducedMotion() ? 100 : 220) : 400;
          occupied += 1;
        }
        if (record.phase === 'entering') schedule(record, () => finishEntrance(record.id));
        else if (record.phase === 'visible') startReading(record);
        else if (record.phase === 'exiting') schedule(record, () => finishExit(record.id));
      }
      emit();
    },
    setPaused(reason, paused) {
      if (pauseReasons.has(reason) === paused) return;
      const wasPaused = pauseReasons.size > 0;
      if (paused) pauseReasons.add(reason);
      else pauseReasons.delete(reason);
      const isPaused = pauseReasons.size > 0;
      if (!wasPaused && isPaused) {
        records.forEach((record) => { if (record.phase === 'visible') stop(record); });
      } else if (wasPaused && !isPaused) {
        records.forEach((record) => {
          if (record.phase === 'visible') {
            record.remaining = Math.max(MIN_RESUME, record.remaining);
            startReading(record);
          }
        });
      }
      emit();
    },
    pin(id) {
      pinned.add(id);
      const record = records.get(id);
      if (record?.phase === 'visible') stop(record);
    },
    dismiss,
    animationEnded(id, name) {
      if (name.startsWith('toast-success-enter') || name === 'toast-slide-down') finishEntrance(id);
      else if (name.startsWith('toast-success-exit') || name === 'toast-fade-out') finishExit(id);
    },
    removeImmediately(id) {
      forget(id);
      emit();
      onRemove(id);
    },
    suspend() {
      suspended = true;
      records.forEach(stop);
    },
  };
}
