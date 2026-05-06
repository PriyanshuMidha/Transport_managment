# Transport App Change Spec

## Current Workflow
- New parcels are always created as `IN_STOCK`.
- Parcel entry requires `Date`, `Supplier Name`, `Receiver Name`, `Transport Name`, `Bill Number`, `Builty Number`, and `Lot Number`.
- `Parcel Opened` is not editable during parcel creation.
- In-stock parcels can be edited or marked as opened.
- Opened parcels can be soft-deleted.
- Deleted parcels are hidden from all reports.

## Frontend Routes
- `/` renders parcel entry.
- `/in-stock-report` renders the in-stock report.
- `/opened-report` renders the opened report.
- `/reports` redirects to `/in-stock-report`.

## Backend APIs
- `POST /api/parcels`
  Creates a parcel and forces `status=IN_STOCK`, `isParcelOpened=false`, `openedDate=null`, `isDeleted=false`, `deletedAt=null`, `deletedBy=null`.
- `PATCH /api/parcels/:id`
  Updates only `date`, `supplierName`, `receiverName`, `transportId`, `billNumber`, `builtyNumber`, and `lotNumber` for non-deleted in-stock parcels.
- `PATCH /api/parcels/:id/open`
  Marks a non-deleted in-stock parcel as opened and stamps `openedDate`.
- `DELETE /api/parcels/:id`
  Soft-deletes a non-deleted opened parcel.
- `GET /api/parcels/report/in-stock?search=abc`
  Returns non-deleted in-stock parcels, searched by `supplierName`, sorted by supplier then date.
- `GET /api/parcels/report/opened?search=abc`
  Returns non-deleted opened parcels, searched by `supplierName`, sorted by supplier then date.
- `DELETE /api/parcels/cleanup/deleted`
  Permanently removes soft-deleted parcels older than 30 days only when `ENABLE_DELETED_PARCEL_CLEANUP=true`.

## Parcel Schema Expectations
- Required fields:
  `date`, `supplierName`, `receiverName`, `transportId`, `billNumber`, `builtyNumber`, `lotNumber`
- Lifecycle fields:
  `isParcelOpened`, `openedDate`, `status`, `isDeleted`, `deletedAt`, `deletedBy`
- Audit fields:
  `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- `deletedBy`, `createdBy`, and `updatedBy` remain `null` unless future user tracking is added.

## Report Behavior
- In Stock Report shows:
  `Date`, `Supplier Name`, `Receiver Name`, `Transport Name`, `Bill Number`, `Builty Number`, `Lot Number`, `Status`, `Action`
- Opened Report shows:
  `Date`, `Supplier Name`, `Receiver Name`, `Transport Name`, `Bill Number`, `Builty Number`, `Lot Number`, `Opened Date`, `Status`, `Action`
- Search is supplier-name only and case-insensitive.
- Search uses debounced API updates and keeps the report mounted while results refresh, so typing does not reload the page or drop input focus.
- Results are grouped supplier-wise in the frontend.
- Desktop uses compact tables. Mobile uses compact cards with full-width controls.
- Frontend API calls read `VITE_API_BASE_URL` and no longer fall back to a localhost backend.
- Capacitor Android uses Vite `dist` assets from `frontend/android` with app id `com.priyanshu.transportmanagement`.

## Deferred Work
- Backend MongoDB connection must come from `MONGO_URI`; localhost should only be used if intentionally provided in the environment.
- Release builds still need the real Render backend URL set in `frontend/.env.production` or equivalent environment injection before generating the final APK.
