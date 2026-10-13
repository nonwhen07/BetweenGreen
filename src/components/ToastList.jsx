import { useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { CircleCheck, X } from 'lucide-react';
import { pushMessage, removeMessage } from '@/features/ui/toastSlice';
import useToastLifecycle from '@/hooks/useToastLifecycle';
import ToastPreview from '@/components/ToastPreview';

const STATUS_CLASS = { success: 'toast-success', warning: 'toast-warning', error: 'toast-danger', info: 'toast-info' };
const STATUS_TEXT = { success: '成功', warning: '警告', error: '錯誤', info: '資訊' };
const PREVIEW_ENABLED = import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('toastPreview') === '1';

const ToastList = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const messages = useSelector((state) => state.toast.messages);
  const previewIds = useRef(new Set());
  const stackRef = useRef(null);
  const returnFocusRef = useRef(null);

  const handleRemove = useCallback((id) => {
    const stack = stackRef.current;
    const activeToast = document.activeElement?.closest?.('[data-toast-id]');
    if (stack?.contains(activeToast) && activeToast.dataset.toastId === String(id)) {
      const nextClose = Array.from(stack.querySelectorAll('.ui-toast:not(.toast-exit) button'))
        .find((button) => !activeToast.contains(button));
      if (nextClose) nextClose.focus();
      else if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
      else stack.focus();
    }
    previewIds.current.delete(id);
    dispatch(removeMessage(id));
  }, [dispatch]);
  const { controller, items, paused } = useToastLifecycle(messages, handleRemove, stackRef);
  const messageById = new Map(messages.map((message) => [message.id, message]));
  const visibleItems = items.filter(({ id, phase }) => phase !== 'queued' && messageById.has(id));

  const showPreview = (text, { autoDismiss = false, status = 'success' } = {}) => {
    if (!PREVIEW_ENABLED) return;
    dispatch(pushMessage({ text, status }));
    const message = store.getState().toast.messages.at(-1);
    if (message) {
      previewIds.current.add(message.id);
      if (!autoDismiss) controller.pin(message.id);
    }
  };
  const clearPreviews = () => {
    Array.from(previewIds.current).forEach((id) => controller.removeImmediately(id));
  };

  return (
    <>
      {PREVIEW_ENABLED && <ToastPreview onShow={showPreview} onClear={clearPreviews}
        paused={paused} queuedCount={items.filter(({ phase }) => phase === 'queued').length} />}
      <div className="toast-container ui-toast-container" style={{ zIndex: 1056 }}>
        <div className="ui-toast-stack" ref={stackRef} tabIndex={-1}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'touch') controller.setPaused('hover', true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== 'touch') controller.setPaused('hover', false);
          }}
          onFocusCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) returnFocusRef.current = event.relatedTarget;
            // 點擊／觸控 X 不把其他通知永久留住；鍵盤焦點仍可暫停閱讀。
            controller.setPaused('focus', event.target.matches(':focus-visible'));
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) controller.setPaused('focus', false);
          }}>
          {visibleItems.map(({ id, phase }) => {
            const message = messageById.get(id);
            const success = message.status === 'success';
            const urgent = message.status === 'error';
            return (
              <div key={id} data-toast-id={id}
                className={`toast ui-toast show ${STATUS_CLASS[message.status] ?? STATUS_CLASS.info}${success ? ' ui-toast--success ui-toast--mist' : ''}${phase === 'exiting' ? ' toast-exit' : ''}`}
                role={urgent ? 'alert' : 'status'} aria-live={urgent ? 'assertive' : 'polite'} aria-atomic="true"
                onAnimationEnd={(event) => {
                  if (event.target === event.currentTarget) controller.animationEnded(id, event.animationName);
                }}>
                {success ? (
                  <div className="ui-toast__success-layout">
                    <span className="ui-toast__status-icon" aria-hidden="true"><CircleCheck size={22} strokeWidth={2} /></span>
                    <div className="ui-toast__copy">
                      <span className="ui-toast__label">操作成功</span>
                      <div className="ui-toast__message">{message.text}</div>
                    </div>
                    <button type="button" className="ui-toast__close" aria-label="關閉成功通知"
                      onClick={() => controller.dismiss(id)}><X size={18} strokeWidth={2} aria-hidden="true" /></button>
                  </div>
                ) : (
                  <>
                    <div className="toast-header ui-toast-header text-white">
                      <span className="ui-toast-title">{STATUS_TEXT[message.status] ?? STATUS_TEXT.info}</span>
                      <button type="button" className="btn-close btn-close-white" aria-label="關閉通知"
                        onClick={() => controller.dismiss(id)} />
                    </div>
                    <div className="toast-body ui-toast-message text-white text-center">{message.text}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ToastList;
