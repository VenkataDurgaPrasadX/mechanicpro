import { useState } from 'react'
import { getParts, saveParts } from '../utils/storage.js'

export default function Inventory() {
  const [parts, setParts] = useState(getParts())
  const [editing, setEditing] = useState(null)

  const update = (id, key, val) => {
    const updated = parts.map(p => p.id === id ? { ...p, [key]: Number(val) || val } : p)
    setParts(updated)
    saveParts(updated)
  }

  const lowStock = parts.filter(p => p.stock <= p.minStock)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeInUp 0.4s ease' }}>
      <div>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'4px' }}>Parts Inventory</h1>
        <p style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{parts.length} parts tracked</p>
      </div>

      {lowStock.length > 0 && (
        <div style={{ background:'var(--red-dim)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'var(--radius-md)', padding:'12px 16px' }}>
          <div style={{ fontSize:'13px', color:'var(--red)', fontWeight:'600', marginBottom:'6px' }}>⚠ Low Stock Alert</div>
          <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>
            {lowStock.map(p => p.name).join(', ')} — reorder soon
          </div>
        </div>
      )}

      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'10px 16px', borderBottom:'1px solid var(--border)', fontSize:'11px', color:'var(--text-tertiary)', fontWeight:'500', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          <span>Part Name</span><span style={{ textAlign:'right' }}>Price</span><span style={{ textAlign:'right' }}>Stock</span><span style={{ textAlign:'right' }}>Min</span>
        </div>
        {parts.map(p => {
          const low = p.stock <= p.minStock
          return (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 16px', borderBottom:'1px solid var(--border)', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'500', color:'var(--text-primary)', marginBottom:'2px' }}>{p.name}</div>
                <div style={{ fontSize:'11px', color:'var(--text-tertiary)' }}>{p.category}</div>
              </div>
              <div style={{ textAlign:'right', fontSize:'13px', color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>₹{p.price}</div>
              <div style={{ textAlign:'right' }}>
                <input type="number" value={p.stock} min={0}
                  onChange={e => update(p.id, 'stock', e.target.value)}
                  style={{ width:'60px', background:'var(--bg-elevated)', border:`1px solid ${low?'var(--red)':'var(--border)'}`, borderRadius:'var(--radius-sm)', padding:'4px 8px', fontSize:'13px', color:low?'var(--red)':'var(--text-primary)', outline:'none', textAlign:'right', fontFamily:'var(--font-mono)' }} />
              </div>
              <div style={{ textAlign:'right', fontSize:'13px', color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>{p.minStock}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
