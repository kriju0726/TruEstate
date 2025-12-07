Overview
TruEstate — Retail Sales Management System prototype. A small full-stack app demonstrating search, multi-filtering, sorting, and pagination over structured sales data. Built to satisfy the TruEstate SDE intern assignment.

Tech Stack
- Backend: Node.js, Express, csv-parser
- Frontend: React, Vite, Axios
- Deployment: Docker / Docker Compose (Procfile included for Heroku-like platforms)

Search Implementation Summary
- Full-text, case-insensitive search across Customer Name and Phone Number.
- Search performed server-side to scale with large CSVs; works alongside filters & sorting.

Filter Implementation Summary
- Multi-select filters: Customer Region, Gender, Product Category, Payment Method, Tags.
- Age Range: preset ranges and custom numeric input (ageMin / ageMax).
- Date: presets (Today, Last 7, Last 30, This Month) + Custom single-date (sets dateFrom = dateTo).
- Filters combine logically (AND) and preserve state with sorting/pagination.

Sorting Implementation Summary
- Supported sorts: Date (Newest first), Quantity (desc), Customer Name (A–Z).
- Sorting applied server-side and preserves active search and filters.

Pagination Implementation Summary
- Page size: 10 items per page.
- Next / Previous navigation and numbered pages.
- Pagination preserves search, filters, and sort state.

Setup Instructions
1. Place the dataset CSV as: backend/data/sales.csv
2. Start backend:
   cd backend
   npm install
   npm run dev
3. Start frontend:
   cd frontend
   npm install
   npm run dev
4. Open: http://localhost:5173
(If port 4000 is in use, start backend with PORT=5000 and set VITE_API_BASE=http://localhost:5000/api in frontend .env)
