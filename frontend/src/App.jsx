import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopControls from './components/TopControls';
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function App(){
  const [q,setQ] = useState('');
  const [filters,setFilters] = useState({regions:[],genders:[],ageMin:null,ageMax:null,categories:[],tags:[],paymentMethods:[],dateFrom:null,dateTo:null});
  const [sort,setSort] = useState('date_desc');
  const [page,setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data,setData] = useState({data:[], total:0, totalPages:0, summary:{}});
  const [metadata, setMetadata] = useState({customer_regions:[], genders:[], product_categories:[], tags:[], payment_methods:[], age_min:null, age_max:null});

  async function loadMetadata(){
    try{
      const res = await axios.get(API_BASE + '/metadata');
      setMetadata(res.data || {});
    }catch(err){ console.error('metadata error', err); }
  }

  async function load(){
    const params = {
      q, page, pageSize, sort,
      regions: filters.regions.join(','),
      genders: filters.genders.join(','),
      ageMin: filters.ageMin, ageMax: filters.ageMax,
      categories: filters.categories.join(','),
      tags: filters.tags.join(','),
      paymentMethods: filters.paymentMethods.join(','),
      dateFrom: filters.dateFrom, dateTo: filters.dateTo
    };
    try{
      const res = await axios.get(API_BASE + '/transactions', { params });
      setData(res.data);
    }catch(err){ console.error(err); }
  }

  useEffect(()=>{ loadMetadata(); load(); }, []);

  useEffect(()=>{ load(); }, [q,filters,sort,page]);

  function refreshAll(){
    loadMetadata();
    load();
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content">
        <div className="topbar">
          <div className="brand"><div className="logo">TS</div><div><div className="title">Sales Management System</div><div className="subtitle">TruEstate</div></div></div>
          <TopControls q={q} setQ={setQ} sort={sort} setSort={setSort} onResetAll={() => {
    setQ("");
    setSort("date_desc");
    setFilters({ regions: [], genders: [], ageMin: null, ageMax: null, categories: [], tags: [], paymentMethods: [], dateFrom: null, dateTo: null
    });
    setPage(1);
  }}
/>

        </div>

        <div className="filters-area card">
          <FilterPanel value={filters} onChange={(upd)=>{ setFilters(prev=>({...prev,...upd})); setPage(1); }} metadata={metadata} />
        </div>

        <div className="summary-row">
          <div className="card small"><div className="muted">Total units sold</div><div className="big">{data.summary?.units_sold ?? '-'}</div></div>
          <div className="card small"><div className="muted">Total Amount</div><div className="big">₹ {data.summary?.total_amount ? Number(data.summary.total_amount).toLocaleString() : '-'}</div></div>
          <div className="card small"><div className="muted">Total Discount</div><div className="big">₹ {data.summary?.total_discount ? Number(data.summary.total_discount).toLocaleString() : '-'}</div></div>
        </div>

        <TransactionTable items={data.data} />

        <div style={{display:'flex', justifyContent:'center', marginTop:12}}>
          <Pagination page={page} totalPages={data.totalPages} onChange={p=>setPage(p)} />
        </div>
      </div>
    </div>
  )
}
