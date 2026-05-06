import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { createParcel, markParcelOpened, updateParcel } from "./api/parcels";
import { createTransport, getTransports } from "./api/transports";
import { AddTransportModal } from "./components/AddTransportModal";
import { ParcelEntryPage } from "./pages/ParcelEntryPage";
import { InStockReportPage } from "./pages/InStockReportPage";
import { OpenedReportPage } from "./pages/OpenedReportPage";

export default function App() {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingParcel, setSavingParcel] = useState(false);
  const [savingTransport, setSavingTransport] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const transportData = await getTransports();
      setTransports(transportData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTransport = async (name) => {
    setSavingTransport(true);

    try {
      const transport = await createTransport({ name });
      setTransports((current) => [...current, transport].sort((a, b) => a.name.localeCompare(b.name)));
      return transport;
    } finally {
      setSavingTransport(false);
    }
  };

  const handleCreateParcel = async (payload) => {
    setSavingParcel(true);
    setSubmitMessage("");

    try {
      await createParcel(payload);
      setSubmitMessage("Parcel saved successfully");
    } finally {
      setSavingParcel(false);
    }
  };

  const handleUpdateParcel = async (parcel, payload) => {
    setActionLoadingId(parcel._id);
    setError("");

    try {
      await updateParcel(parcel._id, payload);
    } catch (actionError) {
      setError(actionError.message);
      throw actionError;
    } finally {
      setActionLoadingId("");
    }
  };

  const handleMarkOpened = async (parcel) => {
    setActionLoadingId(parcel._id);
    setError("");

    try {
      await markParcelOpened(parcel._id);
    } catch (actionError) {
      setError(actionError.message);
      throw actionError;
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <>
      <div className="app-shell">
        <header className="hero-card">
          <p className="eyebrow">Transport Stock Management</p>
          <div className="hero-row">
            <div>
              <h1>Parcel, supplier, and transport tracking.</h1>
              <p className="hero-copy">
                Record incoming parcels, manage transport names, and move stock from in-stock to opened with audit-ready dates.
              </p>
            </div>
            <nav className="nav-tabs">
              <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                Parcel Entry
              </NavLink>
              <NavLink to="/in-stock-report" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                In Stock Report
              </NavLink>
              <NavLink to="/opened-report" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                Opened Report
              </NavLink>
            </nav>
          </div>
        </header>

        {error ? <div className="banner error-banner">{error}</div> : null}
        {loading ? <div className="card loading-card">Loading data...</div> : null}

        {!loading ? (
          <Routes>
            <Route
              path="/"
              element={
                <ParcelEntryPage
                  transports={transports}
                  onSubmit={handleCreateParcel}
                  onAddTransportClick={() => setModalOpen(true)}
                  loading={savingParcel}
                  submitMessage={submitMessage}
                />
              }
            />
            <Route
              path="/in-stock-report"
              element={
                <InStockReportPage
                  transports={transports}
                  onMarkOpened={handleMarkOpened}
                  onUpdateParcel={handleUpdateParcel}
                  actionLoadingId={actionLoadingId}
                  onAddTransportClick={() => setModalOpen(true)}
                />
              }
            />
            <Route path="/opened-report" element={<OpenedReportPage />} />
            <Route path="/reports" element={<Navigate to="/in-stock-report" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : null}
      </div>

      <AddTransportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTransport}
        loading={savingTransport}
      />
    </>
  );
}
