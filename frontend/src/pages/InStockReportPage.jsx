import { useEffect, useState } from "react";
import { getInStockReport } from "../api/parcels";
import { EditParcelModal } from "../components/EditParcelModal";
import { ReportTable } from "../components/ReportTable";

export const InStockReportPage = ({
  transports,
  onMarkOpened,
  onUpdateParcel,
  actionLoadingId,
  onAddTransportClick,
}) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [editingParcel, setEditingParcel] = useState(null);

  const loadRows = async (searchText = search, options = {}) => {
    const { preserveRows = false } = options;

    if (preserveRows) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getInStockReport(searchText);
      setRows(response);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      if (preserveRows) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadRows(search, { preserveRows: rows.length > 0 || search.trim().length > 0 });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const handleUpdateParcel = async (parcel, payload) => {
    setError("");

    try {
      await onUpdateParcel(parcel, payload);
      await loadRows(search);
    } catch (submitError) {
      setError(submitError.message);
      throw submitError;
    }
  };

  const handleMarkOpened = async (parcel) => {
    setError("");

    try {
      await onMarkOpened(parcel);
      await loadRows(search);
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  return (
    <>
      <div className="page-grid reports-grid">
        {error ? <div className="banner error-banner">{error}</div> : null}
        {loading ? (
          <div className="card loading-card">Loading in-stock parcels...</div>
        ) : (
          <ReportTable
            title="In Stock Report"
            rows={rows}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by supplier name"
            loading={searchLoading}
            emptyMessage="No in-stock parcels found."
            actions={[
              {
                key: "edit",
                label: "Edit",
                loadingId: "",
                onClick: (row) => setEditingParcel(row),
              },
              {
                key: "open",
                label: "Mark as Opened",
                loadingId: actionLoadingId,
                loadingLabel: "Opening...",
                onClick: handleMarkOpened,
              },
            ]}
          />
        )}
      </div>

      <EditParcelModal
        open={Boolean(editingParcel)}
        onClose={() => setEditingParcel(null)}
        parcel={editingParcel}
        transports={transports}
        onSubmit={handleUpdateParcel}
        onAddTransportClick={onAddTransportClick}
      />
    </>
  );
};
