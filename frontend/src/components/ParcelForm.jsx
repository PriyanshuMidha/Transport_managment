import { useEffect, useState } from "react";
import { TransportDropdown } from "./TransportDropdown";

const getTodayString = () => new Date().toISOString().split("T")[0];

const createInitialFormState = () => ({
  date: getTodayString(),
  supplierName: "",
  receiverName: "",
  transportId: "",
  billNumber: "",
  builtyNumber: "",
  lotNumber: "",
});

const sanitizeFormValues = (values) => ({
  date: values?.date ? values.date.toString().split("T")[0] : getTodayString(),
  supplierName: values?.supplierName || "",
  receiverName: values?.receiverName || "",
  transportId: values?.transportId?._id || values?.transportId || "",
  billNumber: values?.billNumber || "",
  builtyNumber: values?.builtyNumber || "",
  lotNumber: values?.lotNumber || "",
});

export const ParcelForm = ({
  transports,
  onSubmit,
  onAddTransportClick,
  loading,
  submitMessage,
  initialValues,
  formTitle = "Create parcel record",
  formEyebrow = "Parcel Entry",
  submitLabel = "Save Parcel",
  resetOnSubmitSuccess = true,
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => sanitizeFormValues(initialValues) || createInitialFormState());
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(sanitizeFormValues(initialValues));
    setError("");
  }, [initialValues]);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.date ||
      !formData.supplierName.trim() ||
      !formData.receiverName.trim() ||
      !formData.transportId ||
      !formData.billNumber.trim() ||
      !formData.builtyNumber.trim() ||
      !formData.lotNumber.trim()
    ) {
      setError("All required fields must be filled");
      return;
    }

    setError("");

    try {
      await onSubmit({
        ...formData,
        supplierName: formData.supplierName.trim(),
        receiverName: formData.receiverName.trim(),
        billNumber: formData.billNumber.trim(),
        builtyNumber: formData.builtyNumber.trim(),
        lotNumber: formData.lotNumber.trim(),
      });

      if (resetOnSubmitSuccess) {
        setFormData(createInitialFormState());
      }
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <form className="card parcel-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{formEyebrow}</p>
          <h2>{formTitle}</h2>
        </div>
        {submitMessage ? <span className="success-pill">{submitMessage}</span> : null}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Date</span>
          <input type="date" value={formData.date} onChange={handleChange("date")} required />
        </label>

        <label className="field">
          <span>Supplier Name</span>
          <input
            type="text"
            value={formData.supplierName}
            onChange={handleChange("supplierName")}
            placeholder="Enter supplier name"
            required
          />
        </label>

        <label className="field">
          <span>Receiver Name</span>
          <input
            type="text"
            value={formData.receiverName}
            onChange={handleChange("receiverName")}
            placeholder="Enter receiver name"
            required
          />
        </label>

        <TransportDropdown
          transports={transports}
          value={formData.transportId}
          onChange={(transportId) => setFormData((current) => ({ ...current, transportId }))}
          onAddTransportClick={onAddTransportClick}
          disabled={loading}
        />

        <label className="field">
          <span>Bill Number</span>
          <input
            type="text"
            value={formData.billNumber}
            onChange={handleChange("billNumber")}
            placeholder="Enter bill number"
            required
          />
        </label>

        <label className="field">
          <span>Builty Number</span>
          <input
            type="text"
            value={formData.builtyNumber}
            onChange={handleChange("builtyNumber")}
            placeholder="Enter builty number"
            required
          />
        </label>

        <label className="field">
          <span>Lot Number</span>
          <input
            type="text"
            value={formData.lotNumber}
            onChange={handleChange("lotNumber")}
            placeholder="Enter lot number"
            required
          />
        </label>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="ghost-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        ) : null}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
