import { useParams } from 'react-router-dom'
import { getJobById, STATUS_LABELS, STATUS_COLORS, getSettings } from '../utils/storage.js'

const STATUS_FLOW  = ['received','working','ready','delivered']
const STATUS_ICONS = { received:'📥', working:'🔧', ready:'✅', delivered:'🏁' }
const STATUS_MSG   = {
  received:  'Your bike has been received at the shop. We will start working on it shortly.',
  working:   'Our mechanic is currently working on your bike. We will notify you when it is ready.',
  ready:     'Great news! Your bike is ready for pickup. Please collect it at your earliest convenience.',
  delivered: 'Your bike has been delivered. Thank you for choosing us!',
}

export default function TrackBike() {
  const { jobId } = useParams()
  const job       = getJobById(jobId)
  const settings  = getSettings()

  if (!job) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔍</div>
        <div style={{ fontSize:'18px', fontWeight:'600', color:'var(--text-primary)', marginBottom:'8px' }}>Job Not Found</div>
        <div style={{ fontSize:'14px', color:'var(--text-secondary)' }}>This tracking link may be invalid or expired.</div>
      </div>
    </div>
  )

  const sc         = STATUS_COLORS[job.status]
  const currentIdx = STATUS_FLOW.indexOf(job.status)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop:'40px' }}>
      <div style={{ width:'100%', maxWidth:'480px', display:'flex', flexDirection:'column', gap:'16px', animation:'fadeInUp 0.4s ease' }}>

        {/* Shop Header */}
        <div style={{ textAlign:'center', marginBottom:'8px' }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>🔧</div>
          <div style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>{settings.shopName}</div>
          <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginTop:'4px' }}>{settings.address} · {settings.phone}</div>
        </div>

        {/* Status Card */}
        <div style={{ background:'var(--bg-card)', border:`2px solid ${sc.border}`, borderRadius:'var(--radius-xl)', padding:'24px', textAlign:'center', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ fontSize:'40px' }}>{STATUS_ICONS[job.status]}</div>
          <div style={{ fontSize:'22px', fontWeight:'700', color:sc.text }}>{STATUS_LABELS[job.status]}</div>
          <p style={{ fontSize:'14px', color:'var(--text-secondary)', lineHeight:1.6 }}>{STATUS_MSG[job.status]}</p>
        </div>

        {/* Progress Steps */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            {STATUS_FLOW.map((s, idx) => {
              const done    = idx <= currentIdx
              const current = idx === currentIdx
              const sc2     = STATUS_COLORS[s]
              return (
                <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', flex:1 }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'50%', border:`2px solid ${current?sc2.text:done?'var(--green)':'var(--border)'}`, background:current?sc2.bg:done?'var(--green-dim)':'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>
                      {done && !current ? '✓' : STATUS_ICONS[s]}
                    </div>
                    <span style={{ fontSize:'9px', color:current?sc2.text:done?'var(--green)':'var(--text-tertiary)', textAlign:'center', fontWeight:current?'600':'400' }}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div style={{ height:'2px', flex:1, background:idx < currentIdx?'var(--green)':'var(--border)', margin:'0 2px', marginBottom:'20px' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bike Details */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
          <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--text-primary)', marginBottom:'4px' }}>Service Details</div>
          {[
            ['Customer',   job.customerName],
            ['Bike',       `${job.bikeModel} · ${job.bikeNumber}`],
            ['Problem',    job.problem],
            ['Received',   new Date(job.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })],
            job.totalAmount ? ['Estimated Bill', `₹${job.totalAmount}`] : null,
          ].filter(Boolean).map(([label, value]) => (
            <div key={label} style={{ display:'flex', gap:'12px', fontSize:'13px' }}>
              <span style={{ color:'var(--text-tertiary)', minWidth:'100px', flexShrink:0 }}>{label}</span>
              <span style={{ color:'var(--text-secondary)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Call button */}
        <a href={`tel:${settings.phone}`} style={{ background:'var(--orange)', color:'#fff', borderRadius:'var(--radius-md)', padding:'14px', fontSize:'14px', fontWeight:'600', textAlign:'center', textDecoration:'none', display:'block', boxShadow:'0 0 20px var(--orange-glow)' }}>
          📞 Call {settings.shopName}
        </a>

        <div style={{ textAlign:'center', fontSize:'11px', color:'var(--text-tertiary)', paddingTop:'4px' }}>
          Powered by MechanicPro · Built with ❤️ by a CSE student
        </div>
      </div>
    </div>
  )
}
