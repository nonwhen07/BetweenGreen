import { useEffect } from 'react';

let lockCount = 0;
let previousBodyStyle = null;

const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return undefined;
    }

    const body = document.body;

    if (lockCount === 0) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const computedPaddingRight =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      previousBodyStyle = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };

      body.classList.add('modal-open');
      body.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(lockCount - 1, 0);

      if (lockCount === 0 && previousBodyStyle) {
        body.classList.remove('modal-open');
        body.style.overflow = previousBodyStyle.overflow;
        body.style.paddingRight = previousBodyStyle.paddingRight;
        previousBodyStyle = null;
      }
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
