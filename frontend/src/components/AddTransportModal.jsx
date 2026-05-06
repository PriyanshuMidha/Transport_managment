import { useState } from "react";

export const AddTransportModal = ({ open, onClose, onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Transport name is required");
      return;
    }

    setError("");

    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleClose = () => {
    setError("");
    setName("");
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Transport</h3>
          <button type="button" className="ghost-button" onClick={handleClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Transport Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter transport name"
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Transport"}
          </button>
        </form>
      </div>
    </div>
  );
};
