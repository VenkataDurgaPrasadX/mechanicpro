import { useParams, useNavigate } from 'react-router-dom'
import { getJobById, getSettings } from '../utils/storage.js'

export default function Billing() {
  const { id } = useParams()
  const nav    = useNavigate()
  const job    = getJobById(id)
  const s      = getSettings()

  if (!job) return null

  const partsTotal = (job.parts||[]).reduce((sum,p) => sum+p.total, 0)
  const subtotal   = partsTotal + (job.labour||0)
  const gst        = Math.round(subtotal * 0.18)
  const total      = subtotal + gst

  const print = () => window.print()

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', maxWidth:'560px', animation:'fadeInUp 0.4s ease' }}>
      <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
        <button onClick={() => nav(-1)} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)', borderRadius:'var(--radius-md)', padding:'8px 12px', cursor:'pointer', fontSize:'13px' }}>← Back</button>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>Bill / Invoice</h1>
        <button onClick={print} style={{ marginLeft:'auto', background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'8px 16px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>🖨 Print</button>
      </div>

      {/* Invoice */}
      <div id="invoice" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'28px', display:'flex', flexDirection:'column', gap:'16px' }}>
        {/* Shop header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom:'16px', borderBottom:'2px solid var(--orange)' }}>
          <div>
            <div style={{ fontSize:'20px', fontWeight:'700', color:'var(--orange)', marginBottom:'4px' }}>🔧 {s.shopName}</div>
            <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{s.address}</div>
            <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>📞 {s.phone}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'11px', color:'var(--text-tertiary)', marginBottom:'4px' }}>Invoice No.</div>
            <div style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>{job.id}</div>
            <div style={{ fontSize:'11px', color:'var(--text-tertiary)', marginTop:'8px' }}>{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
        </div>

        {/* Customer + Bike */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div>
            <div style={{ fontSize:'11px', color:'var(--text-tertiary)', marginBottom:'6px', letterSpacing:'0.06em', textTransform:'uppercase' }}>Bill To</div>
            <div style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)' }}>{job.customerName}</div>
            <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>📞 {job.phone}</div>
          </div>
          <div>
            <div style={{ fontSize:'11px', color:'var(--text-tertiary)', marginBottom:'6px', letterSpacing:'0.06em', textTransform:'uppercase' }}>Vehicle</div>
            <div style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)' }}>{job.bikeModel}</div>
            <div style={{ fontSize:'12px', color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{job.bikeNumber}</div>
          </div>
        </div>

        {/* Service */}
        <div style={{ background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', padding:'12px 14px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-tertiary)', marginBottom:'6px', letterSpacing:'0.06em', textTransform:'uppercase' }}>Service Done</div>
          <div style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{job.problem}</div>
        </div>

        {/* Parts table */}
        {(job.parts||[]).length > 0 && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'8px 12px', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', fontSize:'11px', color:'var(--text-tertiary)', fontWeight:'500', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              <span>Part</span><span style={{textAlign:'right'}}>Rate</span><span style={{textAlign:'center'}}>Qty</span><span style={{textAlign:'right'}}>Amount</span>
            </div>
            {job.parts.map((p,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'8px 12px', borderBottom:'1px solid var(--border)', fontSize:'13px' }}>
                <span style={{ color:'var(--text-secondary)' }}>{p.name}</span>
                <span style={{ textAlign:'right', color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>₹{p.price}</span>
                <span style={{ textAlign:'center', color:'var(--text-tertiary)' }}>{p.qty}</span>
                <span style={{ textAlign:'right', color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>₹{p.total}</span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div style={{ display:'flex', flexDirection:'column', gap:'6px', paddingTop:'8px' }}>
          {[
            ['Parts Total', `₹${partsTotal}`],
            [`Labour Charges`, `₹${job.labour||0}`],
            ['Subtotal', `₹${subtotal}`],
            [`GST (${s.gst}%)`, `₹${gst}`],
          ].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px' }}>
              <span style={{ color:'var(--text-tertiary)' }}>{l}</span>
              <span style={{ color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'18px', fontWeight:'700', paddingTop:'10px', borderTop:'2px solid var(--orange)' }}>
            <span style={{ color:'var(--text-primary)' }}>TOTAL</span>
            <span style={{ color:'var(--orange)', fontFamily:'var(--font-mono)' }}>₹{total}</span>
          </div>
        </div>

        {/* UPI */}
        {s.upiId && (
          <div style={{ textAlign:'center', paddingTop:'12px', borderTop:'1px solid var(--border)', fontSize:'12px', color:'var(--text-secondary)' }}>
            💳 Pay via UPI: <strong style={{ color:'var(--text-primary)' }}>{s.upiId}</strong>
          </div>
        )}

        <div style={{ textAlign:'center', fontSize:'12px', color:'var(--text-tertiary)', paddingTop:'8px' }}>
          Thank you for your business! 🙏
        </div>
      </div>
    </div>
  )
}
