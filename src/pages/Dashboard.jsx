import { useNavigate } from 'react-router-dom'
import { getJobs, getStats, getSettings, STATUS_COLORS, STATUS_LABELS } from '../utils/storage.js'

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'18px 20px', display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize:'20px' }}>{icon}</span>
      </div>
      <div style={{ fontSize:'28px', fontWeight:'700', color, fontFamily:'var(--font-mono)', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'11px', color:'var(--text-tertiary)' }}>{sub}</div>}
    </div>
  )
}

function JobRow({ job, onClick }) {
  const sc = STATUS_COLORS[job.status]
  return (
    <div onClick={() => onClick(job.id)} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', cursor:'pointer', transition:'all 0.15s ease' }}
      onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-mid)'}
      onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
    >
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'13px', fontWeight:'500', color:'var(--text-primary)', marginBottom:'2px' }}>{job.customerName}</div>
        <div style={{ fontSize:'11px', color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>{job.bikeNumber} · {job.bikeModel}</div>
      </div>
      <div style={{ fontSize:'12px', color:'var(--text-secondary)', flex:1, display:'flex', alignItems:'center' }}>{job.problem?.slice(0,40)}{job.problem?.length > 40 ? '...' : ''}</div>
      <div style={{ fontSize:'11px', color:'var(--text-tertiary)', whiteSpace:'nowrap' }}>{new Date(job.createdAt).toLocaleDateString('en-IN')}</div>
      <div style={{ fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px', background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, whiteSpace:'nowrap' }}>
        {STATUS_LABELS[job.status]}
      </div>
    </div>
  )
}

function Dashboard() {
  const stats  = getStats()
  const jobs   = getJobs()
  const settings = getSettings()
  const nav    = useNavigate()
  const activeJobs = jobs.filter(j => j.status !== 'delivered').slice(0, 8)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', color:'var(--text-primary)', marginBottom:'4px' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {settings.ownerName} 👋
          </h1>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <button onClick={() => nav('/jobs/new')} style={{ background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor:'pointer', boxShadow:'0 0 20px var(--orange-glow)' }}>
          + New Job Card
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        <StatCard label="Active Jobs"    value={stats.activeJobs}    color="var(--amber)"  icon="🔧" sub="Bikes in shed right now" />
        <StatCard label="Ready for Pickup" value={stats.readyJobs}   color="var(--green)"  icon="✅" sub="Call customers now" />
        <StatCard label="Today's Income"  value={`₹${stats.todayIncome}`} color="var(--orange)" icon="💰" sub="Delivered today" />
        <StatCard label="This Week"       value={`₹${stats.weekIncome}`}  color="var(--blue)"  icon="📈" sub="Last 7 days income" />
      </div>

      {/* Ready for Pickup Alert */}
      {stats.readyJobs > 0 && (
        <div style={{ background:'var(--green-dim)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'var(--radius-md)', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px', animation:'fadeIn 0.3s ease' }}>
          <span style={{ fontSize:'16px' }}>🔔</span>
          <span style={{ fontSize:'13px', color:'var(--green)', fontWeight:'500' }}>
            {stats.readyJobs} bike{stats.readyJobs > 1 ? 's are' : ' is'} ready for pickup — contact the customer{stats.readyJobs > 1 ? 's' : ''}!
          </span>
          <button onClick={() => nav('/jobs')} style={{ marginLeft:'auto', fontSize:'12px', color:'var(--green)', background:'none', border:'1px solid rgba(34,197,94,0.4)', borderRadius:'var(--radius-sm)', padding:'4px 10px', cursor:'pointer' }}>View Jobs</button>
        </div>
      )}

      {/* Active Jobs */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <h2 style={{ fontSize:'15px', fontWeight:'600', color:'var(--text-primary)' }}>Active Jobs</h2>
          <button onClick={() => nav('/jobs')} style={{ fontSize:'12px', color:'var(--text-secondary)', background:'none', border:'none', cursor:'pointer' }}>View all →</button>
        </div>
        {activeJobs.length === 0 ? (
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'40px', textAlign:'center' }}>
            <div style={{ fontSize:'32px', marginBottom:'10px' }}>🏍️</div>
            <div style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'16px' }}>No active jobs right now</div>
            <button onClick={() => nav('/jobs/new')} style={{ background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>Create First Job Card</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {activeJobs.map(job => <JobRow key={job.id} job={job} onClick={id => nav(`/jobs/${id}`)} />)}
          </div>
        )}
      </div>
    </div>
  )
}
export default Dashboard
