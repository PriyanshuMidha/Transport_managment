import { useState } from "react";

export const ConfirmDeleteModal = ({ open, onClose, onConfirm, loading }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    try {
      await onConfirm(password);
      setPassword("");
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleClose = () => {
    setError("");
    setPassword("");
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Deletion</h3>
          <button type="button" className="ghost-button" onClick={handleClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Enter password to delete this parcel</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoFocus
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="danger-button" disabled={loading}>
            {loading ? "Deleting..." : "Delete Parcel"}
          </button>
        </form>
      </div>
    </div>
  );
};
