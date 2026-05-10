import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJobs, deleteJob, STATUS_LABELS, STATUS_COLORS } from '../utils/storage.js'

export default function Jobs() {
  const nav = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const allJobs = getJobs()

  const filtered = allJobs.filter(j => {
    const matchFilter = filter === 'all' || j.status === filter
    const matchSearch = !search ||
      j.customerName.toLowerCase().includes(search.toLowerCase()) ||
      j.bikeNumber.toLowerCase().includes(search.toLowerCase()) ||
      j.phone.includes(search)
    return matchFilter && matchSearch
  })

  const FILTERS = [
    { key:'all',       label:`All (${allJobs.length})` },
    { key:'received',  label:`Received (${allJobs.filter(j=>j.status==='received').length})` },
    { key:'working',   label:`Working (${allJobs.filter(j=>j.status==='working').length})`   },
    { key:'ready',     label:`Ready (${allJobs.filter(j=>j.status==='ready').length})`       },
    { key:'delivered', label:`Delivered (${allJobs.filter(j=>j.status==='delivered').length})` },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', animation:'fadeInUp 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>All Jobs</h1>
        <button onClick={() => nav('/jobs/new')} style={{ background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'10px 20px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>+ New Job</button>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search by name, bike number or phone..."
        style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'11px 14px', fontSize:'13px', color:'var(--text-primary)', outline:'none', width:'100%' }} />

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'20px', border:'1px solid var(--border)', background:filter===f.key?'var(--orange-dim)':'var(--bg-card)', color:filter===f.key?'var(--orange)':'var(--text-secondary)', cursor:'pointer', fontWeight:filter===f.key?'600':'400' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)' }}>
          <div style={{ fontSize:'32px', marginBottom:'10px' }}>🏍️</div>
          <div style={{ fontSize:'14px', color:'var(--text-secondary)' }}>No jobs found</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {filtered.map(job => {
            const sc = STATUS_COLORS[job.status]
            return (
              <div key={job.id} onClick={() => nav(`/jobs/${job.id}`)}
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px', cursor:'pointer', display:'flex', gap:'12px', alignItems:'center', transition:'all 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-mid)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
              >
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)', marginBottom:'3px' }}>{job.customerName}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-tertiary)', fontFamily:'var(--font-mono)' }}>{job.bikeNumber} · {job.bikeModel} · {job.phone}</div>
                </div>
                <div style={{ fontSize:'12px', color:'var(--text-secondary)', flex:1 }}>{job.problem?.slice(0,50)}{job.problem?.length>50?'...':''}</div>
                <div style={{ fontSize:'11px', color:'var(--text-tertiary)', whiteSpace:'nowrap' }}>{new Date(job.createdAt).toLocaleDateString('en-IN')}</div>
                {job.totalAmount > 0 && <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--orange)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>₹{job.totalAmount}</div>}
                <div style={{ fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px', background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, whiteSpace:'nowrap' }}>
                  {STATUS_LABELS[job.status]}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
