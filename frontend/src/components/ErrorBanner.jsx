export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex justify-between gap-3 px-3 py-2 rounded-[var(--radius)] mb-3 bg-bad-bg text-bad text-sm" role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="text-lg leading-none bg-transparent border-0 cursor-pointer text-inherit" onClick={onDismiss} aria-label="Dismiss">
          &times;
        </button>
      )}
    </div>
  );
}
