import React, {useState} from 'react';
export default function Sidebar(){
  const [open, setOpen] = useState({services:false, invoices:false});
  return (
    <div className="sidebar">
      <div className="side-brand"><div className="side-logo">TS</div><div><div className="side-name">Vault</div><div style={{fontSize:12,opacity:0.8}}>Anurag Yadav</div></div></div>
      <div className="nav">
        <div className="item">Dashboard</div>
        <div className="item">Nexus</div>
        <div className="item">Intake</div>

        <div className="item" onClick={()=>setOpen(o=>({...o, services: !o.services}))}>
          <span>Services</span><span>{open.services?'-':'+'}</span>
        </div>
        {open.services && <div className="submenu"><a>Pre-active</a><a>Active</a><a>Blocked</a><a>Closed</a></div>}

        <div className="item" onClick={()=>setOpen(o=>({...o, invoices: !o.invoices}))}>
          <span>Invoices</span><span>{open.invoices?'-':'+'}</span>
        </div>
        {open.invoices && <div className="submenu"><a>Proforma Invoices</a><a>Final Invoices</a></div>}
      </div>
    </div>
  )
}
