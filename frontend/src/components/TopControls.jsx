// import React from 'react';
// export default function TopControls({metadata, q, setQ, refreshAll, sort, setSort}){
//   return (
//     <div className="top-controls">
//       <button className="btn ghost" onClick={refreshAll}>Refresh</button>
//       <div className="search-wrap"><div className="search"><input placeholder="Name, Phone no." value={q} onChange={e=>setQ(e.target.value)} /></div></div>
//       <select className="select" onChange={e=>setSort(e.target.value)} value={sort}>
//         <option value="date_desc">Sort by: Date (Newest)</option>
//         <option value="customer_asc">Sort by: Customer Name (A-Z)</option>
//         <option value="quantity">Sort by: Quantity</option>
//       </select>
//     </div>
//   )
// }




import React from 'react';

export default function TopControls({ q, setQ, sort, setSort, onResetAll }) {
  return (
    <div className="top-controls">
      {/* Refresh now fully resets UI */}
      <button className="btn ghost" onClick={onResetAll}>Refresh</button>

      <div className="search-wrap">
        <div className="search">
          <input
            placeholder="Name, Phone no."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      <select className="select" onChange={e => setSort(e.target.value)} value={sort}>
        <option value="date_desc">Sort by: Date (Newest)</option>
        <option value="customer_asc">Sort by: Customer Name (A-Z)</option>
        <option value="quantity">Sort by: Quantity</option>
      </select>
    </div>
  );
}
