import React from 'react';
export default function TransactionTable({items}) {
  if(!items || items.length===0) return <div className='card'>No results</div>;
  return (
    <div className='card table-wrap'>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th><th>Date</th><th>Customer ID</th><th>Customer name</th><th>Phone</th><th>Gender</th><th>Age</th><th>Product Category</th><th style={{textAlign:'right'}}>Quantity</th><th style={{textAlign:'right'}}>Total Amount</th><th>Customer region</th><th>Product ID</th><th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx)=>(
            <tr key={idx}>
              <td>{it.transaction_id || '-'}</td>
              <td>{it.date?new Date(it.date).toLocaleDateString():'-'}</td>
              <td>{it.customer_id||'-'}</td>
              <td style={{fontWeight:700}}>{it.customer_name||'-'}</td>
              <td style={{color:'#6b7280', cursor:'pointer'}}>
  {it.phone || '-'}
  {it.phone && (
    <span
      className="phone-copy"
      title="Copy phone number"
      onClick={() => {
        navigator.clipboard.writeText(it.phone);
        alert(`Copied: ${it.phone}`);
      }}
      style={{ marginLeft: 8 }}
    >
      📋
    </span>
  )}
</td>
              <td>{it.gender||'-'}</td>
              <td>{it.age!=null?it.age:'-'}</td>
              <td>{it.product_category||'-'}</td>
              <td style={{textAlign:'right'}}>{it.quantity!=null?it.quantity:'-'}</td>
              <td style={{textAlign:'right',fontWeight:700}}>₹ {it.final_amount!=null?it.final_amount.toLocaleString():'-'}</td>
              <td>{it.customer_region||'-'}</td>
              <td>{it.product_id||'-'}</td>
              <td>{it.employee_name||'-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
