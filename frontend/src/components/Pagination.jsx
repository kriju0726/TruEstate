import React from 'react';
export default function Pagination({page,totalPages,onChange}) {
  const pages=[]; const start=Math.max(1,page-2);
  for(let i=start;i<=Math.min(totalPages,start+4);i++) pages.push(i);
  return (
    <div className='pagination'>
      <button className='page-btn' disabled={page<=1} onClick={()=>onChange(page-1)}>Prev</button>
      {pages.map(p=>(<button key={p} className={`page-btn ${p===page?'active':''}`} onClick={()=>onChange(p)}>{p}</button>))}
      <button className='page-btn' disabled={page>=totalPages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  )
}
