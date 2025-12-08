# Architecture — TruEstate Prototype

## Overview
Two-tier architecture: React frontend (Vite) + Node/Express backend. Backend reads CSV into memory at startup and exposes REST endpoints.

## Backend architecture
- Entry: backend/index.js — loads CSV (backend/data/sales.csv) using csv-parser, starts Express server.
- Routes: backend/routes/api.js
  - GET /api/transactions — paginated results with search, filters, sorting; returns summary {units_sold, total_amount, total_discount}
  - GET /api/metadata — unique values for regions, genders, categories, tags, payment methods, age min/max
- Controllers: backend/controllers/* — contain request handling and filter/sort/pagination logic.
- Services: backend/services/dataService.js — CSV normalization, in-memory storage, metadata extraction.
- Error handling: startup checks for CSV presence; endpoints return 400/500 with messages.

## Frontend architecture
- Entry: frontend/src/main.jsx -> App.jsx
- Components:
  - Sidebar.jsx — left nav with dropdowns
  - TopControls.jsx — search, refresh, sort
  - FilterPanel.jsx — filters, age range, date presets, tags
  - TransactionTable.jsx — table UI with copy phone action
  - Pagination.jsx — page controls
- Services: frontend uses axios in App.jsx to call /api/metadata and /api/transactions.

## Data Flow
1. Frontend requests metadata -> populates dropdowns/tags.
2. Frontend requests /api/transactions with query params: q, page, pageSize, sort, regions, genders, ageMin, ageMax, categories, tags, paymentMethods, dateFrom, dateTo.
3. Backend filters/searches the in-memory transactions array, sorts, computes summary, paginates, and responds.
4. Frontend renders table and summary cards.

## Folder structure
(root)
├─ backend/
│  ├─ controllers/
│  ├─ services/
│  ├─ routes/
│  └─ index.js
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  └─ App.jsx
├─ docs/
│  └─ architecture.md
├─ images/
├─ README.md

## Module responsibilities
- dataService.js: CSV normalization and metadata extraction.
- transactionsController.js: query parsing, filtering, sorting, pagination, summary computation.
- FilterPanel.jsx / TopControls.jsx / TransactionTable.jsx: UI and user interaction; keep logic minimal, state in App.jsx.

## Edge cases handled
- No results -> frontend shows "No results".
- Invalid ranges -> front prevents non-numeric values; backend ignores nulls.
- Missing optional fields -> normalization provides defaults; table shows '-' if missing.
- Large CSV -> in-memory load is used (suitable for assignment); for production recommend DB or streaming + indexes.
