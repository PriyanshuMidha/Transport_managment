import { useEffect, useRef, useState } from "react";

export const TransportDropdown = ({
  transports,
  value,
  onChange,
  onAddTransportClick,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedTransport = transports.find((transport) => transport._id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (transportId) => {
    onChange(transportId);
    setOpen(false);
  };

  const handleAddClick = () => {
    setOpen(false);
    onAddTransportClick();
  };

  return (
    <div className="field" ref={containerRef}>
      <span>Transport Name</span>
      <div className="custom-select">
        <button
          type="button"
          className="custom-select-trigger"
          onClick={() => setOpen((current) => !current)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={selectedTransport ? "" : "custom-select-placeholder"}>
            {selectedTransport ? selectedTransport.name : "Select transport"}
          </span>
          <span className="custom-select-caret">▾</span>
        </button>

        {open ? (
          <ul className="custom-select-menu" role="listbox">
            {transports.map((transport) => (
              <li key={transport._id} role="option" aria-selected={transport._id === value}>
                <button
                  type="button"
                  className={`custom-select-option ${transport._id === value ? "selected" : ""}`}
                  onClick={() => handleSelect(transport._id)}
                >
                  {transport.name}
                </button>
              </li>
            ))}
            <li role="none">
              <button type="button" className="custom-select-option custom-select-add" onClick={handleAddClick}>
                + Add Transport
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};
