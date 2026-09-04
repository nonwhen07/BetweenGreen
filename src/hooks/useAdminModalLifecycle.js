import { useCallback, useEffect, useRef } from 'react';

import useBodyScrollLock from '@/hooks/useBodyScrollLock';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const useAdminModalLifecycle = ({
  isOpen,
  onClose,
  isDismissDisabled = false,
}) => {
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    previouslyFocusedElementRef.current = document.activeElement;
    const modalElement = modalRef.current;
    const animationFrameId = window.requestAnimationFrame(() => {
      const firstFocusableElement = modalElement?.querySelector(FOCUSABLE_SELECTOR);
      (firstFocusableElement || modalElement)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);

      const previousElement = previouslyFocusedElementRef.current;
      if (previousElement instanceof HTMLElement && document.contains(previousElement)) {
        previousElement.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const modalElement = modalRef.current;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (!isDismissDisabled) onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalElement) return;

      const focusableElements = [...modalElement.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
        (element) => element.getAttribute('aria-hidden') !== 'true',
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDismissDisabled, isOpen, onClose]);

  const handleBackdropMouseDown = useCallback(
    (event) => {
      if (!isDismissDisabled && event.target === event.currentTarget) onClose();
    },
    [isDismissDisabled, onClose],
  );

  return {
    modalRef,
    handleBackdropMouseDown,
  };
};

export default useAdminModalLifecycle;
