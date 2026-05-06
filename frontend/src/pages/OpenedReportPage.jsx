import { useEffect, useState } from "react";
import { deleteParcel, getOpenedReport } from "../api/parcels";
import { ReportTable } from "../components/ReportTable";

export const OpenedReportPage = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");

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

  const handleDelete = async (parcel) => {
    setActionLoadingId(parcel._id);
    setError("");

    try {
      await deleteParcel(parcel._id);
      await loadRows(search);
    } catch (actionError) {
      setError(actionError.message);
    } finally {
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
            actions={[
              {
                key: "delete",
                label: "Delete",
                variant: "danger",
                loadingId: actionLoadingId,
                loadingLabel: "Deleting...",
                onClick: handleDelete,
              },
            ]}
          />
        )}
      </div>
    </>
  );
};
