import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getJobById, saveJob, deleteJob, STATUS, STATUS_LABELS, STATUS_COLORS, getParts } from '../utils/storage.js'

const STATUS_FLOW = [STATUS.RECEIVED, STATUS.WORKING, STATUS.READY, STATUS.DELIVERED]

function JobDetail() {
  const { id } = useParams()
  const nav    = useNavigate()
  const [job, setJob]       = useState(null)
  const [parts, setParts]   = useState([])
  const [labour, setLabour] = useState(0)
  const [copied, setCopied] = useState(false)
  const [addingPart, setAddingPart] = useState(false)
  const [selectedPart, setSelectedPart] = useState('')
  const [partQty, setPartQty] = useState(1)

  useEffect(() => {
    const j = getJobById(id)
    if (!j) { nav('/jobs'); return }
    setJob(j)
    setLabour(j.labour || 0)
    setParts(j.parts || [])
  }, [id])

  if (!job) return null

  const allParts   = getParts()
  const sc         = STATUS_COLORS[job.status]
  const currentIdx = STATUS_FLOW.indexOf(job.status)

  const updateStatus = (newStatus) => {
    const updated = { ...job, status: newStatus, updatedAt: new Date().toISOString() }
    saveJob(updated)
    setJob(updated)
  }

  const addPart = () => {
    const part = allParts.find(p => p.id === selectedPart)
    if (!part) return
    const newParts = [...parts, { ...part, qty: partQty, total: part.price * partQty }]
    setParts(newParts)
    updateBill(newParts, labour)
    setAddingPart(false)
    setSelectedPart('')
    setPartQty(1)
  }

  const removePart = (idx) => {
    const newParts = parts.filter((_, i) => i !== idx)
    setParts(newParts)
    updateBill(newParts, labour)
  }

  const updateBill = (p, l) => {
    const partsTotal  = p.reduce((sum, x) => sum + x.total, 0)
    const subtotal    = partsTotal + Number(l)
    const gst         = Math.round(subtotal * 0.18)
    const totalAmount = subtotal + gst
    const updated = { ...job, parts: p, labour: Number(l), totalAmount, updatedAt: new Date().toISOString() }
    saveJob(updated)
    setJob(updated)
  }

  const trackURL = `${window.location.origin}/mechanicpro/track/${job.id}`

  const copyTrackLink = () => {
    navigator.clipboard.writeText(trackURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const msg = `Hi ${job.customerName}! Your ${job.bikeModel} (${job.bikeNumber}) status: *${STATUS_LABELS[job.status]}*. Track here: ${trackURL}`
    window.open(`https://wa.me/${job.phone}?text=${encodeURIComponent(msg)}`)
  }

  const partsTotal = parts.reduce((sum, p) => sum + p.total, 0)
  const subtotal   = partsTotal + Number(labour)
  const gst        = Math.round(subtotal * 0.18)
  const total      = subtotal + gst

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', flexWrap:'wrap' }}>
        <button onClick={() => nav('/jobs')} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)', borderRadius:'var(--radius-md)', padding:'8px 12px', cursor:'pointer', fontSize:'13px', flexShrink:0 }}>← Back</button>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap', marginBottom:'4px' }}>
            <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>{job.customerName}</h1>
            <div style={{ fontSize:'12px', fontWeight:'600', padding:'3px 12px', borderRadius:'20px', background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>
              {STATUS_LABELS[job.status]}
            </div>
          </div>
          <div style={{ fontSize:'12px', color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>
            {job.bikeNumber} · {job.bikeModel} · {job.phone} · Job ID: {job.id}
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
          <button onClick={copyTrackLink} style={{ fontSize:'12px', padding:'8px 14px', borderRadius:'var(--radius-md)', border:'1px solid var(--border)', background:'var(--bg-card)', color: copied?'var(--green)':'var(--text-secondary)', cursor:'pointer' }}>
            {copied ? '✓ Copied!' : '🔗 Copy Track Link'}
          </button>
          <button onClick={shareWhatsApp} style={{ fontSize:'12px', padding:'8px 14px', borderRadius:'var(--radius-md)', border:'1px solid rgba(34,197,94,0.3)', background:'var(--green-dim)', color:'var(--green)', cursor:'pointer' }}>
            📱 WhatsApp
          </button>
          <button onClick={() => nav(`/billing/${job.id}`)} style={{ fontSize:'12px', padding:'8px 14px', borderRadius:'var(--radius-md)', border:'1px solid rgba(255,107,43,0.3)', background:'var(--orange-dim)', color:'var(--orange)', cursor:'pointer' }}>
            🧾 Generate Bill
          </button>
        </div>
      </div>

      {/* Status Progress */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'20px' }}>
        <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', marginBottom:'16px' }}>Update Status</div>
        <div style={{ display:'flex', alignItems:'center', gap:'0' }}>
          {STATUS_FLOW.map((s, idx) => {
            const isDone   = idx <= currentIdx
            const isCurrent= idx === currentIdx
            const sc2      = STATUS_COLORS[s]
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flex:1 }}>
                  <button onClick={() => updateStatus(s)}
                    style={{ width:'36px', height:'36px', borderRadius:'50%', border:`2px solid ${isCurrent?sc2.text:isDone?'var(--green)':'var(--border)'}`, background:isCurrent?sc2.bg:isDone?'var(--green-dim)':'var(--bg-elevated)', color:isCurrent?sc2.text:isDone?'var(--green)':'var(--text-tertiary)', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease' }}>
                    {isDone && !isCurrent ? '✓' : ['📥','🔧','✅','🏁'][idx]}
                  </button>
                  <span style={{ fontSize:'10px', color:isCurrent?sc2.text:isDone?'var(--green)':'var(--text-tertiary)', fontWeight:isCurrent?'600':'400', textAlign:'center' }}>
                    {STATUS_LABELS[s]}
                  </span>
                </div>
                {idx < STATUS_FLOW.length - 1 && (
                  <div style={{ height:'2px', flex:1, background:idx < currentIdx?'var(--green)':'var(--border)', margin:'0 4px', marginBottom:'20px', transition:'all 0.4s ease' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Two column — Problem + Billing */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Problem */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'20px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)' }}>🔧 Problem Description</div>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)', lineHeight:1.6 }}>{job.problem}</p>
          {job.notes && (
            <>
              <div style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-tertiary)', borderTop:'1px solid var(--border)', paddingTop:'10px' }}>Notes</div>
              <p style={{ fontSize:'12px', color:'var(--text-secondary)', lineHeight:1.6 }}>{job.notes}</p>
            </>
          )}
          {job.estimatedCost && (
            <div style={{ background:'var(--amber-dim)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:'var(--radius-md)', padding:'10px 12px', fontSize:'12px', color:'var(--amber)' }}>
              Estimated Cost: ₹{job.estimatedCost}
            </div>
          )}
        </div>

        {/* Billing */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'20px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)' }}>💰 Bill</div>
            <button onClick={() => setAddingPart(true)} style={{ fontSize:'11px', color:'var(--orange)', background:'var(--orange-dim)', border:'1px solid rgba(255,107,43,0.3)', borderRadius:'var(--radius-sm)', padding:'4px 10px', cursor:'pointer' }}>+ Add Part</button>
          </div>

          {addingPart && (
            <div style={{ background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', padding:'12px', display:'flex', flexDirection:'column', gap:'8px', border:'1px solid var(--border)' }}>
              <select value={selectedPart} onChange={e => setSelectedPart(e.target.value)}
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'8px', fontSize:'12px', color:'var(--text-primary)', outline:'none' }}>
                <option value="">Select part...</option>
                {allParts.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
              </select>
              <div style={{ display:'flex', gap:'8px' }}>
                <input type="number" value={partQty} min={1} onChange={e => setPartQty(Number(e.target.value))}
                  style={{ width:'70px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'8px', fontSize:'12px', color:'var(--text-primary)', outline:'none' }} />
                <button onClick={addPart} style={{ flex:1, background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:'8px', fontSize:'12px', cursor:'pointer' }}>Add</button>
                <button onClick={() => setAddingPart(false)} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)', borderRadius:'var(--radius-sm)', padding:'8px 12px', fontSize:'12px', cursor:'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Parts list */}
          {parts.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
              {parts.map((p, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'12px', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--text-secondary)' }}>{p.name} × {p.qty}</span>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <span style={{ color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>₹{p.total}</span>
                    <button onClick={() => removePart(i)} style={{ fontSize:'10px', color:'var(--red)', background:'none', border:'none', cursor:'pointer' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Labour */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'12px' }}>
            <span style={{ color:'var(--text-secondary)' }}>Labour Charges</span>
            <input type="number" value={labour} onChange={e => { setLabour(e.target.value); updateBill(parts, e.target.value) }}
              placeholder="0"
              style={{ width:'90px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'5px 8px', fontSize:'12px', color:'var(--text-primary)', outline:'none', textAlign:'right', fontFamily:'var(--font-mono)' }} />
          </div>

          {/* Totals */}
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:'10px', display:'flex', flexDirection:'column', gap:'5px' }}>
            {[['Subtotal', `₹${subtotal}`], ['GST (18%)', `₹${gst}`]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                <span style={{ color:'var(--text-tertiary)' }}>{l}</span>
                <span style={{ color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'15px', fontWeight:'700', paddingTop:'6px', borderTop:'1px solid var(--border)' }}>
              <span style={{ color:'var(--text-primary)' }}>Total</span>
              <span style={{ color:'var(--orange)', fontFamily:'var(--font-mono)' }}>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default JobDetail
