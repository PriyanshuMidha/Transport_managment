import { NavLink, Outlet } from "react-router-dom";

export const AppLayout = ({ error, loading, onLogout }) => (
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
        <div className="nav-cluster">
          <nav className="nav-tabs">
            <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
              Parcel Entry
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
              Reports
            </NavLink>
          </nav>
          <button type="button" className="ghost-button logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>

    {error ? <div className="banner error-banner">{error}</div> : null}
    {loading ? <div className="card loading-card">Loading data...</div> : <Outlet />}
  </div>
);
