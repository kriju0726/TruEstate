import React, { useState, useEffect } from 'react';

const AGE_RANGES = [
  { label: 'Any', min: null, max: null },
  { label: '21 - 30', min: 21, max: 30 },
  { label: '31 - 40', min: 31, max: 40 },
  { label: '41 - 50', min: 41, max: 50 },
  { label: '51 - 60', min: 51, max: 60 },
  { label: 'Above 60', min: 61, max: null },
  { label: 'Custom', min: null, max: null }
];

const DATE_PRESETS = [
  { key: 'any', label: 'Any' },
  { key: 'today', label: 'Today' },
  { key: 'last7', label: 'Last 7 days' },
  { key: 'last30', label: 'Last 30 days' },
  { key: 'month', label: 'This month' },
  { key: 'custom', label: 'Custom' }
];

function isoDate(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function FilterPanel({ value, onChange, metadata }) {
  const [local, setLocal] = useState(value || {});
  const [ageKey, setAgeKey] = useState('Any');
  const [datePreset, setDatePreset] = useState('any');

  useEffect(() => {
    setLocal(value || {});
    // infer ageKey from incoming value
    const found = AGE_RANGES.find(ar =>
      (ar.min === value?.ageMin || (ar.min == null && value?.ageMin == null))
      && (ar.max === value?.ageMax || (ar.max == null && value?.ageMax == null))
    );
    setAgeKey(found ? found.label : 'Custom');

    // infer date preset simple: if both dateFrom/dateTo equal today -> today
    // else if both null -> 'any' else 'custom' or range presets not inferred reliably
    if (!value?.dateFrom && !value?.dateTo) setDatePreset('any');
    else if (value?.dateFrom && value?.dateTo && value.dateFrom === value.dateTo) setDatePreset('today'); // could be custom exact date too
    else setDatePreset('custom');
  }, [value]);

  function updateField(field, v) {
    const next = { ...local, [field]: v };
    setLocal(next);
    onChange(next);
  }

  function onAgeChange(e) {
    const key = e.target.value;
    setAgeKey(key);
    const found = AGE_RANGES.find(ar => ar.label === key);
    if (!found) return;
    // for 'Custom' we keep whatever local had, or nulls
    if (found.label === 'Custom') {
      updateField('ageMin', null);
      updateField('ageMax', null);
    } else {
      updateField('ageMin', found.min);
      updateField('ageMax', found.max);
    }
  }

  function applyDatePreset(key) {
    setDatePreset(key);
    const today = new Date();
    if (key === 'any') {
      updateField('dateFrom', null);
      updateField('dateTo', null);
    } else if (key === 'today') {
      const d = isoDate(today);
      updateField('dateFrom', d);
      updateField('dateTo', d);
    } else if (key === 'last7') {
      const d = new Date();
      d.setDate(d.getDate() - 6); // 7 days including today
      updateField('dateFrom', isoDate(d));
      updateField('dateTo', isoDate(today));
    } else if (key === 'last30') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      updateField('dateFrom', isoDate(d));
      updateField('dateTo', isoDate(today));
    } else if (key === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      updateField('dateFrom', isoDate(start));
      updateField('dateTo', isoDate(today));
    } else if (key === 'custom') {
      // leave dateFrom/dateTo as-is; user will pick single date below
      // (we will set both dateFrom and dateTo to the chosen custom date)
      // If previously had a single date, keep it
      if (local.dateFrom && local.dateFrom === local.dateTo) {
        // keep as is
      } else {
        updateField('dateFrom', null);
        updateField('dateTo', null);
      }
    }
  }

  // single-date handler: sets both dateFrom and dateTo to selected date
  function onSingleDateChange(d) {
    if (!d) {
      updateField('dateFrom', null);
      updateField('dateTo', null);
    } else {
      updateField('dateFrom', d);
      updateField('dateTo', d);
    }
  }

  function toggleTag(tag) {
    const nextTags = local.tags && local.tags.includes(tag) ? local.tags.filter(t => t !== tag) : [...(local.tags || []), tag];
    updateField('tags', nextTags);
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <select className="select" value={(local.regions || []).join(',')} onChange={e => updateField('regions', e.target.value ? e.target.value.split(',') : [])}>
        <option value=''>Customer Region</option>
        {metadata?.customer_regions?.map(r => (<option key={r} value={r}>{r}</option>))}
      </select>

      <select className="select" value={(local.genders || []).join(',')} onChange={e => updateField('genders', e.target.value ? e.target.value.split(',') : [])}>
        <option value=''>Gender</option>
        {metadata?.genders?.map(g => (<option key={g} value={g}>{g}</option>))}
      </select>

      {/* Age Range dropdown */}
      <select className="select" value={ageKey} onChange={onAgeChange}>
        {AGE_RANGES.map(ar => <option key={ar.label} value={ar.label}>{ar.label}</option>)}
      </select>

      {/* When Custom chosen, show numeric inputs */}
      {ageKey === 'Custom' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input className="select" type="number" placeholder="Age min" value={local.ageMin || ''} onChange={e => updateField('ageMin', e.target.value ? Number(e.target.value) : null)} />
          <input className="select" type="number" placeholder="Age max" value={local.ageMax || ''} onChange={e => updateField('ageMax', e.target.value ? Number(e.target.value) : null)} />
        </div>
      )}

      <select className="select" value={(local.categories || []).join(',')} onChange={e => updateField('categories', e.target.value ? e.target.value.split(',') : [])}>
        <option value=''>Product Category</option>
        {metadata?.product_categories?.map(c => (<option key={c} value={c}>{c}</option>))}
      </select>

      <select className="select" value={(local.paymentMethods || []).join(',')} onChange={e => updateField('paymentMethods', e.target.value ? e.target.value.split(',') : [])}>
        <option value=''>Payment Method</option>
        {metadata?.payment_methods?.map(p => (<option key={p} value={p}>{p}</option>))}
      </select>

      {/* Date presets */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <select className="select" value={datePreset} onChange={e => applyDatePreset(e.target.value)}>
          {DATE_PRESETS.map(dp => <option key={dp.key} value={dp.key}>{dp.label}</option>)}
        </select>

        {/* Single date input only when preset is 'custom' OR when user wants exact match */}
        {datePreset === 'custom' && (
          <input className="select" type="date" value={local.dateFrom || ''} onChange={e => onSingleDateChange(e.target.value || null)} />
        )}
      </div>

      
    </div>
  );
}
