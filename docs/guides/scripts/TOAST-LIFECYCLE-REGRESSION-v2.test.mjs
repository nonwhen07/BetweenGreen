import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = await readFile(new URL('../../../src/features/ui/toastLifecycle.js', import.meta.url), 'utf8');
const { createToastLifecycle } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function fixture({ reduced = false } = {}) {
  let now = 0;
  let token = 0;
  const tasks = new Map();
  const removed = [];
  const controller = createToastLifecycle({
    onRemove: (id) => removed.push(id), reducedMotion: () => reduced,
    clock: { now: () => now, setTimeout(callback, delay) {
      token += 1; tasks.set(token, { at: now + delay, callback }); return token;
    }, clearTimeout: (id) => tasks.delete(id) },
  });
  const advance = (ms) => {
    const target = now + ms;
    while (true) {
      const next = Array.from(tasks).filter(([, task]) => task.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at; tasks.delete(next[0]); next[1].callback();
    }
    now = target;
  };
  const sync = (ids, status = 'success') => controller.sync(ids.map((id) => ({ id, status })));
  const phase = (id) => controller.getSnapshot().items.find((item) => item.id === id)?.phase;
  return { controller, advance, sync, phase, removed, tasks };
}

test('success gets five full seconds after entrance, then exit', () => {
  const f = fixture(); f.sync([1]); f.advance(220); assert.equal(f.phase(1), 'visible');
  f.advance(4999); assert.equal(f.phase(1), 'visible'); f.advance(1); assert.equal(f.phase(1), 'exiting');
  f.advance(179); assert.deepEqual(f.removed, []); f.advance(1); assert.deepEqual(f.removed, [1]);
});
test('warning gets seven seconds with the shared A animation', () => {
  const f = fixture(); f.sync([1], 'warning'); f.advance(220 + 6999); assert.equal(f.phase(1), 'visible');
  f.advance(1); assert.equal(f.phase(1), 'exiting'); f.advance(180); assert.deepEqual(f.removed, [1]);
});
test('hover preserves remaining time across new Redux messages', () => {
  const f = fixture(); f.sync([1]); f.advance(220 + 3000); f.controller.setPaused('hover', true);
  f.sync([1, 2]); f.advance(9000); assert.equal(f.phase(1), 'visible'); assert.equal(f.phase(2), 'visible');
  f.controller.setPaused('hover', false); f.advance(1999); assert.equal(f.phase(1), 'visible');
  f.advance(1); assert.equal(f.phase(1), 'exiting'); assert.equal(f.phase(2), 'visible');
});
test('focus and hidden reasons cannot be undone by mouse leaving', () => {
  const f = fixture(); f.sync([1]); f.advance(220 + 1000);
  f.controller.setPaused('hover', true); f.controller.setPaused('focus', true); f.controller.setPaused('hidden', true);
  f.controller.setPaused('hover', false); f.controller.setPaused('hidden', false); f.advance(10000);
  assert.equal(f.phase(1), 'visible'); f.controller.setPaused('focus', false); f.advance(3999);
  assert.equal(f.phase(1), 'visible'); f.advance(1); assert.equal(f.phase(1), 'exiting');
});
test('near-expiry resume gives at least two seconds', () => {
  const f = fixture(); f.sync([1]); f.advance(220 + 4800); f.controller.setPaused('hover', true);
  f.advance(3000); f.controller.setPaused('hover', false); f.advance(1999);
  assert.equal(f.phase(1), 'visible'); f.advance(1); assert.equal(f.phase(1), 'exiting');
});
test('entrance during pause receives its full dwell when resumed', () => {
  const f = fixture(); f.controller.setPaused('hidden', true); f.sync([1]); f.advance(10000);
  assert.equal(f.phase(1), 'visible'); f.controller.setPaused('hidden', false); f.advance(4999);
  assert.equal(f.phase(1), 'visible'); f.advance(1); assert.equal(f.phase(1), 'exiting');
});
test('queue stays unmounted and uncounted, including during exit', () => {
  const f = fixture(); f.sync([1, 2, 3, 4, 5]); assert.equal(f.phase(4), 'queued');
  f.advance(220 + 1000); f.controller.dismiss(1); f.sync([1, 2, 3, 4, 5]); assert.equal(f.phase(4), 'queued');
  f.advance(180); f.sync([2, 3, 4, 5]); assert.equal(f.phase(4), 'entering');
  f.advance(220 + 4999); assert.equal(f.phase(4), 'visible'); f.advance(1); assert.equal(f.phase(4), 'exiting');
});
test('repeated close and hover cannot revive an exiting card', () => {
  const f = fixture(); f.sync([1]); f.advance(220); f.controller.dismiss(1); f.advance(50);
  f.controller.dismiss(1); f.controller.setPaused('hover', true); f.controller.setPaused('hover', false);
  f.advance(130); assert.deepEqual(f.removed, [1]); f.advance(10000); assert.deepEqual(f.removed, [1]);
});
test('animationend and timer fallback remove only once', () => {
  const f = fixture(); f.sync([1]); f.controller.animationEnded(1, 'toast-enter');
  f.controller.dismiss(1); f.controller.animationEnded(1, 'toast-leave'); f.advance(10000);
  assert.deepEqual(f.removed, [1]);
});
test('pinned sample stays, timed samples use the same lifecycle', () => {
  const f = fixture(); f.controller.pin(1); f.sync([1, 2]); f.advance(10000);
  assert.equal(f.phase(1), 'visible'); assert.deepEqual(f.removed, [2]); f.controller.dismiss(1);
  f.advance(180); assert.deepEqual(f.removed, [2, 1]);
});
test('clear test ID does not change unrelated timer', () => {
  const f = fixture(); f.sync([1, 2]); f.advance(220 + 2000); f.controller.removeImmediately(1);
  f.sync([2]); f.advance(2999); assert.equal(f.phase(2), 'visible'); f.advance(1); assert.equal(f.phase(2), 'exiting');
});
test('external Redux removal clears its timer and frees a queue slot', () => {
  const f = fixture(); f.sync([1, 2, 3, 4]); f.advance(220); f.sync([2, 3, 4]);
  assert.equal(f.phase(4), 'entering'); f.advance(10000); assert.equal(f.removed.includes(1), false);
});
test('suspend cleans all timers; StrictMode-style setup resumes remaining time', () => {
  const f = fixture(); f.sync([1]); f.advance(220 + 1000); f.controller.suspend(); assert.equal(f.tasks.size, 0);
  f.sync([1]); f.advance(3999); assert.equal(f.phase(1), 'visible'); f.advance(1); assert.equal(f.phase(1), 'exiting');
});
test('reduced motion uses 100ms entry and exit without changing dwell', () => {
  const f = fixture({ reduced: true }); f.sync([1]); f.advance(100 + 5000);
  assert.equal(f.phase(1), 'exiting'); f.advance(100); assert.deepEqual(f.removed, [1]);
});

for (const status of ['error', 'info']) {
  test(`${status} uses the shared animation with its correct reading time`, () => {
    const f = fixture(); f.sync([1], status); f.advance(220);
    f.advance((status === 'error' ? 7000 : 5000) - 1); assert.equal(f.phase(1), 'visible');
    f.advance(1); assert.equal(f.phase(1), 'exiting'); f.advance(180); assert.deepEqual(f.removed, [1]);
  });
  test(`${status} reduced motion matches CSS duration`, () => {
    const f = fixture({ reduced: true }); f.sync([1], status); f.advance(100);
    assert.equal(f.phase(1), 'visible'); f.controller.dismiss(1); f.advance(100); assert.deepEqual(f.removed, [1]);
  });
}

test('warning also uses the 100ms reduced-motion entry and exit', () => {
  const f = fixture({ reduced: true }); f.sync([1], 'warning'); f.advance(100);
  assert.equal(f.phase(1), 'visible'); f.controller.dismiss(1); f.advance(100);
  assert.deepEqual(f.removed, [1]);
});
