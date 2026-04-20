// if (!show) return null	React 最推薦 pattern
// role="status"	accessibility
// aria-busy	screen reader
// zIndex prop	可以客製

// 這個元件只負責顯示 loading，是否顯示和商業邏輯無關，
// 應該由父層決定要不要 render PageLoader
const PageLoader = ({ show = false, zIndex = 9999 }) => {
  if (!show) return null;

  return (
    <div
      className="ui-fullpage-loader"
      style={{ zIndex }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="ui-spinner ui-spinner--page" />
    </div>
  );
};

export default PageLoader;
