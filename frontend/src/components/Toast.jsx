import { useEffect } from "react";

export const Toast = ({ message, onDismiss, duration = 3000 }) => {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timeoutId);
  }, [message, duration, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
};
