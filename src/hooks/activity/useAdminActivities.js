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

export const useAdminActivities = ({
  module = 'all',
  dashboard = false,
  limit = null,
} = {}) => {
  const dispatch = useDispatch();
  const storedActivities = useSelector(selectAdminActivities);
  const status = useSelector(selectAdminActivitiesStatus);
  const error = useSelector(selectAdminActivitiesError);

  useEffect(() => {
    dispatch(ensureAdminActivities()).catch(() => undefined);
  }, [dispatch]);

  const activities = useMemo(() => {
    const reviewedCutoff =
      Date.now() - DASHBOARD_REVIEWED_DAYS * 24 * 60 * 60 * 1000;

    const filteredActivities = storedActivities
      .filter((activity) => module === 'all' || activity.module === module)
      .filter((activity) => {
        if (!dashboard || !activity.isReviewed) return true;

        return new Date(activity.createdAt).getTime() >= reviewedCutoff;
      })
      .sort((left, right) => {
        if (dashboard && left.isReviewed !== right.isReviewed) {
          return left.isReviewed ? 1 : -1;
        }

        return (
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
        );
      });

    return limit ? filteredActivities.slice(0, limit) : filteredActivities;
  }, [dashboard, limit, module, storedActivities]);

  const addActivity = useCallback(
    (activityData) => dispatch(recordAdminActivity(activityData)).unwrap(),
    [dispatch],
  );

  const markActivityReviewed = useCallback(
    (activityId, isReviewed = true) =>
      dispatch(
        setAdminActivityReviewed({ activityId, isReviewed }),
      ).unwrap(),
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
