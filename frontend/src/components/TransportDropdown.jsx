export const TransportDropdown = ({
  transports,
  value,
  onChange,
  onAddTransportClick,
  disabled = false,
}) => {
  const addOptionValue = "__add_transport__";

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (nextValue === addOptionValue) {
      onAddTransportClick();
      return;
    }

    onChange(nextValue);
  };

  return (
    <label className="field">
      <span>Transport Name</span>
      <select value={value} onChange={handleChange} disabled={disabled} required>
        <option value="">Select transport</option>
        {transports.map((transport) => (
          <option key={transport._id} value={transport._id}>
            {transport.name}
          </option>
        ))}
        <option value={addOptionValue}>+ Add Transport</option>
      </select>
    </label>
  );
};
