import { useState } from "react";
import { ParcelForm } from "./ParcelForm";

export const EditParcelModal = ({
  open,
  onClose,
  parcel,
  transports,
  onSubmit,
  onAddTransportClick,
}) => {
  const [loading, setLoading] = useState(false);

  if (!open || !parcel) {
    return null;
  }

  const handleSubmit = async (payload) => {
    setLoading(true);

    try {
      await onSubmit(parcel, payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card modal-card-large" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit In-Stock Parcel</h3>
          <button type="button" className="ghost-button" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>

        <ParcelForm
          transports={transports}
          initialValues={parcel}
          onSubmit={handleSubmit}
          onAddTransportClick={onAddTransportClick}
          loading={loading}
          submitMessage=""
          formEyebrow="Edit Parcel"
          formTitle="Update parcel details"
          submitLabel="Save Changes"
          resetOnSubmitSuccess={false}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
