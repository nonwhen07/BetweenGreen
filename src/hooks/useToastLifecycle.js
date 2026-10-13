import { useEffect, useState, useSyncExternalStore } from 'react';
import { createToastLifecycle } from '@/features/ui/toastLifecycle';

export default function useToastLifecycle(messages, onRemove, stackRef) {
  // onRemove 由呼叫端 useCallback 保持穩定；controller 每次掛載只有一份。
  const [controller] = useState(() => createToastLifecycle({
    onRemove,
    reducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot);

  useEffect(() => {
    const updateEnvironment = () => {
      const stack = stackRef.current;
      const available = !document.hidden && document.hasFocus();
      const reasons = {
        hidden: document.hidden,
        window: !document.hasFocus(),
        hover: available && window.matchMedia('(hover: hover)').matches && !!stack?.matches(':hover'),
        focus: !!stack?.contains(document.activeElement) && document.activeElement.matches(':focus-visible'),
      };
      // 先新增暫停原因，再移除已解除的原因，避免中途誤恢復。
      Object.entries(reasons).filter(([, active]) => active).forEach(([reason]) => controller.setPaused(reason, true));
      Object.entries(reasons).filter(([, active]) => !active).forEach(([reason]) => controller.setPaused(reason, false));
    };
    updateEnvironment();
    document.addEventListener('visibilitychange', updateEnvironment);
    window.addEventListener('blur', updateEnvironment);
    window.addEventListener('focus', updateEnvironment);
    return () => {
      document.removeEventListener('visibilitychange', updateEnvironment);
      window.removeEventListener('blur', updateEnvironment);
      window.removeEventListener('focus', updateEnvironment);
      controller.suspend();
    };
  }, [controller, stackRef]);

  useEffect(() => { controller.sync(messages); }, [controller, messages]);
  return { controller, items: snapshot.items, paused: snapshot.paused };
}
