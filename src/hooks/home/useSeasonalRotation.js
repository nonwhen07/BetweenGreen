import { useCallback, useEffect, useState } from 'react';

export const useSeasonalRotation = ({ itemCount, delay = 6000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const safeActiveIndex = itemCount > 0 ? activeIndex % itemCount : 0;
  const isRotationPaused =
    isUserPaused || isInteractionPaused || prefersReducedMotion || itemCount <= 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPrefersReducedMotion(event.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isRotationPaused) return undefined;

    const timerId = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % itemCount);
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [delay, isRotationPaused, itemCount, safeActiveIndex]);

  const selectItem = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const toggleUserPause = useCallback(() => {
    setIsUserPaused((isPaused) => !isPaused);
  }, []);

  const setInteractionPaused = useCallback((isPaused) => {
    setIsInteractionPaused(isPaused);
  }, []);

  return {
    activeIndex: safeActiveIndex,
    isUserPaused,
    isRotationPaused,
    prefersReducedMotion,
    selectItem,
    toggleUserPause,
    setInteractionPaused,
  };
};
