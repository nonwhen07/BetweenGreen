import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// features
import {
  ensureAdminActivities,
  recordAdminActivity,
  selectAdminActivities,
  selectAdminActivitiesError,
  selectAdminActivitiesStatus,
  setAdminActivityReviewed,
} from '@/features/activity/activitySlice';

const DASHBOARD_REVIEWED_DAYS = 14;
const DASHBOARD_REVIEWED_CUTOFF =
  Date.now() - DASHBOARD_REVIEWED_DAYS * 24 * 60 * 60 * 1000;

export const useAdminActivities = ({
  module = 'all',
  dashboard = false,
  reviewedLimit = null,
} = {}) => {
  const dispatch = useDispatch();
  const storedActivities = useSelector(selectAdminActivities);
  const status = useSelector(selectAdminActivitiesStatus);
  const error = useSelector(selectAdminActivitiesError);

  useEffect(() => {
    dispatch(ensureAdminActivities()).catch(() => undefined);
  }, [dispatch]);

  const activities = useMemo(() => {
    const filteredActivities = storedActivities
      .filter((activity) => module === 'all' || activity.module === module)
      .filter((activity) => {
        if (!dashboard || !activity.isReviewed) return true;

        return new Date(activity.createdAt).getTime() >= DASHBOARD_REVIEWED_CUTOFF;
      })
      .sort((left, right) => {
        if (dashboard && left.isReviewed !== right.isReviewed) {
          return left.isReviewed ? 1 : -1;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      });

    if (reviewedLimit === null) return filteredActivities;

    const visibleReviewedIds = new Set(
      filteredActivities
        .filter((activity) => activity.isReviewed)
        .sort(
          (left, right) =>
            new Date(right.reviewedAt || right.createdAt).getTime() -
            new Date(left.reviewedAt || left.createdAt).getTime(),
        )
        .slice(0, reviewedLimit)
        .map((activity) => activity.id),
    );

    return filteredActivities.filter(
      (activity) => !activity.isReviewed || visibleReviewedIds.has(activity.id),
    );
  }, [dashboard, module, reviewedLimit, storedActivities]);

  const addActivity = useCallback(
    (activityData) => dispatch(recordAdminActivity(activityData)).unwrap(),
    [dispatch],
  );

  const markActivityReviewed = useCallback(
    (activityId, isReviewed = true) =>
      dispatch(setAdminActivityReviewed({ activityId, isReviewed })).unwrap(),
    [dispatch],
  );

  return {
    activities,
    status,
    error,
    addActivity,
    markActivityReviewed,
  };
};
