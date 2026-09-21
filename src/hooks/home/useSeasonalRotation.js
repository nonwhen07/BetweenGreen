import { useCallback, useEffect, useState } from 'react';

export const useSeasonalRotation = ({ itemCount, delay = 6000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isPointerPaused, setIsPointerPaused] = useState(false);
  const [isKeyboardPaused, setIsKeyboardPaused] = useState(false);
  const [rotationCycle, setRotationCycle] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const safeActiveIndex = itemCount > 0 ? activeIndex % itemCount : 0;
  const isRotationPaused =
    isUserPaused || isPointerPaused || isKeyboardPaused || prefersReducedMotion || itemCount <= 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
      setRotationCycle((currentCycle) => currentCycle + 1);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isRotationPaused) return undefined;

    const timerId = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % itemCount);
      setRotationCycle((currentCycle) => currentCycle + 1);
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [delay, isRotationPaused, itemCount, rotationCycle]);

  const selectItem = useCallback((index) => {
    setActiveIndex(index);
    setRotationCycle((currentCycle) => currentCycle + 1);
  }, []);

  const toggleUserPause = useCallback(() => {
    setIsUserPaused((isPaused) => !isPaused);
    setRotationCycle((currentCycle) => currentCycle + 1);
  }, []);

  const setPointerPaused = useCallback((isPaused) => {
    setIsPointerPaused(isPaused);
    setRotationCycle((currentCycle) => currentCycle + 1);
  }, []);

  const setKeyboardPaused = useCallback((isPaused) => {
    setIsKeyboardPaused(isPaused);
    setRotationCycle((currentCycle) => currentCycle + 1);
  }, []);

  return {
    activeIndex: safeActiveIndex,
    rotationCycle,
    isUserPaused,
    isRotationPaused,
    prefersReducedMotion,
    selectItem,
    toggleUserPause,
    setPointerPaused,
    setKeyboardPaused,
  };
};
