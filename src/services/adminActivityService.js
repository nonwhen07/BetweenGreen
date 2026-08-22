const STORAGE_KEY = 'between-green:admin-activities:v1';
const REVIEWED_RETENTION_DAYS = 90;

const isBrowserStorageAvailable = () =>
  typeof window !== 'undefined' && Boolean(window.localStorage);

const createActivityId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeActivities = (source) => {
  if (!Array.isArray(source)) return [];

  return source
    .filter((activity) => activity && typeof activity === 'object')
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
};

const pruneActivities = (activities) => {
  const reviewedCutoff = Date.now() - REVIEWED_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  return activities.filter((activity) => {
    if (!activity.isReviewed) return true;

    const createdAt = new Date(activity.createdAt).getTime();
    return Number.isFinite(createdAt) && createdAt >= reviewedCutoff;
  });
};

const readActivities = () => {
  if (!isBrowserStorageAvailable()) return [];

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];

    return pruneActivities(normalizeActivities(JSON.parse(storedValue)));
  } catch {
    return [];
  }
};

const writeActivities = (activities) => {
  if (!isBrowserStorageAvailable()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
};

export const getAdminActivities = async () => {
  const activities = readActivities();
  writeActivities(activities);
  return activities;
};

export const createAdminActivity = async (activityData) => {
  const activity = {
    id: createActivityId(),
    module: activityData.module,
    action: activityData.action,
    status: activityData.status,
    totalCount: activityData.totalCount,
    successCount: activityData.successCount,
    errorCount: activityData.errorCount,
    isReviewed: Boolean(activityData.isReviewed),
    createdAt: activityData.createdAt || new Date().toISOString(),
    details: Array.isArray(activityData.details) ? activityData.details : [],
  };

  const activities = pruneActivities([activity, ...readActivities()]);
  writeActivities(activities);

  return activity;
};

export const updateAdminActivityReviewed = async (
  activityId,
  isReviewed,
) => {
  let updatedActivity = null;
  const activities = readActivities().map((activity) => {
    if (activity.id !== activityId) return activity;

    updatedActivity = {
      ...activity,
      isReviewed,
      reviewedAt: isReviewed ? new Date().toISOString() : null,
    };

    return updatedActivity;
  });

  if (!updatedActivity) {
    throw new Error('找不到指定的操作紀錄');
  }

  writeActivities(pruneActivities(activities));
  return updatedActivity;
};

// TODO(json-server)：保留相同函式介面，未來只需將 localStorage 實作替換成 API。
