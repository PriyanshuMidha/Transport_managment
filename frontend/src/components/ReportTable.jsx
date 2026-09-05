import { useState } from "react";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN");
};

const groupBySupplier = (rows) =>
  rows.reduce((groups, row) => {
    const key = row.supplierName || "Unknown Supplier";

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(row);
    return groups;
  }, {});

const renderActionButton = (row, action) => (
  <button
    key={action.key}
    type="button"
    className={action.variant === "danger" ? "danger-button" : "secondary-button"}
    onClick={() => action.onClick(row)}
    disabled={action.loadingId === row._id}
  >
    {action.loadingId === row._id ? action.loadingLabel || "Working..." : action.label}
  </button>
);

export const ReportTable = ({
  title,
  rows,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  actions = [],
  showOpenedDate = false,
  loading = false,
  emptyMessage = "No parcels found.",
}) => {
  const groups = groupBySupplier(rows);
  const supplierNames = Object.keys(groups);
  const desktopColSpan = showOpenedDate ? 10 : 9;
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpanded = (id) => {
    setExpandedIds((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <section className="card report-card">
      <div className="report-header">
        <div className="report-header-copy">
          <div>
            <p className="eyebrow">Report</p>
            <h2>{title}</h2>
          </div>
          {loading ? <span className="report-loading-text">Updating results...</span> : null}
        </div>
        <div className="report-header-tools">
          <label className="field search-field">
            <span>Search Supplier</span>
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </label>
          <span className="table-count">{rows.length} records</span>
        </div>
      </div>

      {supplierNames.length === 0 ? (
        <div className="empty-report-state">{emptyMessage}</div>
      ) : (
        <div className="report-groups">
          {supplierNames.map((supplierName) => (
            <section key={supplierName} className="supplier-group">
              <div className="supplier-group-heading">
                <h3>{supplierName}</h3>
                <span>{groups[supplierName].length} records</span>
              </div>

              <div className="table-shell desktop-report">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Supplier Name</th>
                      <th>Receiver Name</th>
                      <th>Transport Name</th>
                      <th>Bill Number</th>
                      <th>Builty Number</th>
                      <th>Lot Number</th>
                      {showOpenedDate ? <th>Opened Date</th> : null}
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups[supplierName].map((row) => (
                      <tr key={row._id}>
                        <td>{formatDate(row.date)}</td>
                        <td>{row.supplierName}</td>
                        <td>{row.receiverName}</td>
                        <td>{row.transportId?.name || "-"}</td>
                        <td>{row.billNumber}</td>
                        <td>{row.builtyNumber}</td>
                        <td>{row.lotNumber}</td>
                        {showOpenedDate ? <td>{formatDate(row.openedDate)}</td> : null}
                        <td>
                          <span className={`status-pill ${row.status === "OPENED" ? "opened" : "stock"}`}>{row.status}</span>
                        </td>
                        <td>
                          <div className="action-stack">
                            {actions.length > 0 ? actions.map((action) => renderActionButton(row, action)) : <span>-</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {groups[supplierName].length === 0 ? (
                      <tr>
                        <td colSpan={desktopColSpan} className="empty-row">
                          No parcels found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="mobile-report">
                {groups[supplierName].map((row) => {
                  const isExpanded = Boolean(expandedIds[row._id]);

                  return (
                    <article key={row._id} className={`report-card-item ${isExpanded ? "expanded" : ""}`}>
                      <button
                        type="button"
                        className="report-card-preview"
                        onClick={() => toggleExpanded(row._id)}
                        aria-expanded={isExpanded}
                      >
                        <div className="report-card-title">
                          <strong>{row.supplierName}</strong>
                          <span className={`status-pill ${row.status === "OPENED" ? "opened" : "stock"}`}>
                            {row.status}
                          </span>
                        </div>
                        <div className="report-card-subline">
                          <span>{formatDate(row.date)}</span>
                          <span>{row.transportId?.name || "-"}</span>
                          <span className="report-card-chevron">{isExpanded ? "Hide" : "View details"}</span>
                        </div>
                      </button>

                      {isExpanded ? (
                        <>
                          <div className="report-card-grid">
                            <div>
                              <span className="card-label">Date</span>
                              <strong>{formatDate(row.date)}</strong>
                            </div>
                            <div>
                              <span className="card-label">Supplier Name</span>
                              <strong>{row.supplierName}</strong>
                            </div>
                            <div>
                              <span className="card-label">Receiver Name</span>
                              <strong>{row.receiverName}</strong>
                            </div>
                            <div>
                              <span className="card-label">Transport Name</span>
                              <strong>{row.transportId?.name || "-"}</strong>
                            </div>
                            <div>
                              <span className="card-label">Bill Number</span>
                              <strong>{row.billNumber}</strong>
                            </div>
                            <div>
                              <span className="card-label">Builty Number</span>
                              <strong>{row.builtyNumber}</strong>
                            </div>
                            <div>
                              <span className="card-label">Lot Number</span>
                              <strong>{row.lotNumber}</strong>
                            </div>
                            {showOpenedDate ? (
                              <div>
                                <span className="card-label">Opened Date</span>
                                <strong>{formatDate(row.openedDate)}</strong>
                              </div>
                            ) : null}
                          </div>
                          <div className="action-stack mobile-actions">
                            {actions.length > 0 ? actions.map((action) => renderActionButton(row, action)) : <span>-</span>}
                          </div>
                        </>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};
