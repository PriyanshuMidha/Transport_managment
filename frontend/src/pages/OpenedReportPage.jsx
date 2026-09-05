import { useEffect, useState } from "react";
import { deleteParcel, getOpenedReport } from "../api/parcels";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { ReportTable } from "../components/ReportTable";

export const OpenedReportPage = ({ canDelete = false }) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [pendingDeleteParcel, setPendingDeleteParcel] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRows = async (searchText = search, options = {}) => {
    const { preserveRows = false } = options;

    if (preserveRows) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getOpenedReport(searchText);
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

  const handleConfirmDelete = async (password) => {
    const parcel = pendingDeleteParcel;
    setDeleting(true);
    setActionLoadingId(parcel._id);
    setError("");

    try {
      await deleteParcel(parcel._id, password);
      setPendingDeleteParcel(null);
      await loadRows(search);
    } catch (actionError) {
      setError(actionError.message);
      throw actionError;
    } finally {
      setDeleting(false);
      setActionLoadingId("");
    }
  };

  return (
    <>
      <div className="page-grid reports-grid">
        {error ? <div className="banner error-banner">{error}</div> : null}
        {loading ? (
          <div className="card loading-card">Loading opened parcels...</div>
        ) : (
          <ReportTable
            title="Opened Report"
            rows={rows}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by supplier name"
            showOpenedDate
            loading={searchLoading}
            emptyMessage="No opened parcels found."
            actions={
              canDelete
                ? [
                    {
                      key: "delete",
                      label: "Delete",
                      variant: "danger",
                      loadingId: actionLoadingId,
                      loadingLabel: "Deleting...",
                      onClick: (parcel) => setPendingDeleteParcel(parcel),
                    },
                  ]
                : []
            }
          />
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDeleteParcel)}
        onClose={() => setPendingDeleteParcel(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
};
