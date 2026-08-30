// constants
import {
  ADMIN_FRESHNESS_RECOMMEND_MINUTES,
  ADMIN_FRESHNESS_STALE_MINUTES,
  ADMIN_FRESHNESS_STATES,
} from '@/constants/adminFreshnessConstants';

const updatedAtFormatter = new Intl.DateTimeFormat('zh-TW', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export const getAdminDataFreshness = (lastFetchedAt, now = Date.now()) => {
  const timestamp = Number(lastFetchedAt);

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return {
      state: ADMIN_FRESHNESS_STATES.EMPTY,
      ageMinutes: null,
      relativeLabel: '尚未成功載入',
      updatedAtLabel: '尚無紀錄',
    };
  }

  const ageMinutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  let state = ADMIN_FRESHNESS_STATES.FRESH;

  if (ageMinutes >= ADMIN_FRESHNESS_STALE_MINUTES) {
    state = ADMIN_FRESHNESS_STATES.STALE;
  } else if (ageMinutes >= ADMIN_FRESHNESS_RECOMMEND_MINUTES) {
    state = ADMIN_FRESHNESS_STATES.RECOMMEND;
  }

  const relativeLabel = ageMinutes < 1 ? '剛剛更新' : `${ageMinutes} 分鐘前更新`;

  return {
    state,
    ageMinutes,
    relativeLabel,
    updatedAtLabel: updatedAtFormatter.format(new Date(timestamp)),
  };
};

export const getAdminDataFreshnessNextDelay = (lastFetchedAt, now = Date.now()) => {
  const timestamp = Number(lastFetchedAt);

  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;

  const { state } = getAdminDataFreshness(timestamp, now);
  let nextThresholdMinutes = null;

  if (state === ADMIN_FRESHNESS_STATES.FRESH) {
    nextThresholdMinutes = ADMIN_FRESHNESS_RECOMMEND_MINUTES;
  } else if (state === ADMIN_FRESHNESS_STATES.RECOMMEND) {
    nextThresholdMinutes = ADMIN_FRESHNESS_STALE_MINUTES;
  }

  if (nextThresholdMinutes === null) return null;

  const nextThresholdAt = timestamp + nextThresholdMinutes * 60000;
  return Math.max(0, nextThresholdAt - now);
};

export const getAdminModuleRefreshMode = ({ status, lastFetchedAt }, now = Date.now()) => {
  if (status === 'loading') return null;
  if (!lastFetchedAt || status === 'idle') return 'initial';

  const freshness = getAdminDataFreshness(lastFetchedAt, now);

  if (status === 'error' || freshness.state === ADMIN_FRESHNESS_STATES.STALE) {
    return 'background';
  }

  return null;
};
