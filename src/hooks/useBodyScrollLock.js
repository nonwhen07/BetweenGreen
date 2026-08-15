import { useEffect } from 'react';

let lockCount = 0;
let previousBodyStyle = null;

const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return undefined;
    }

    const body = document.body;

    // 第一個 Modal 開啟時才記錄原始樣式
    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      const computedPaddingRight =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      previousBodyStyle = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };

      body.classList.add('modal-open');
      body.style.overflow = 'hidden';

      // 補償 scrollbar 消失後的寬度，避免畫面左右跳動
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
      }
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(lockCount - 1, 0);

      // 所有 Modal 都關閉後才解除鎖定
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
