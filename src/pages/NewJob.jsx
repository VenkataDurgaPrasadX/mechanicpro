import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveJob, generateJobId } from '../utils/storage.js'

const BIKE_TYPES = ['Pulsar','Splendor','Activa','Jupiter','Apache','Duke','Bullet','Shine','Unicorn','FZ','R15','Gixxer','Other']
const COMMON_PROBLEMS = ['Engine Oil Change','Full Service','Brakes Issue','Chain Problem','Tyre Puncture','Starting Problem','Electrical Issue','Suspension Issue','Clutch Problem','Battery Dead','Gear Problem','Other']

const inputStyle = {
  background:'var(--bg-elevated)',
  border:'1px solid var(--border)',
  borderRadius:'var(--radius-md)',
  padding:'10px 12px',
  fontSize:'13px',
  color:'var(--text-primary)',
  outline:'none',
  width:'100%',
}

const labelStyle = {
  fontSize:'12px',
  fontWeight:'500',
  color:'var(--text-secondary)',
}

export default function NewJob() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    customerName:'', phone:'', bikeNumber:'', bikeModel:'Pulsar',
    problem:'', notes:'', estimatedCost:'', estimatedDate:''
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.customerName.trim()) err.customerName = 'Customer name required'
    if (!form.phone.trim() || form.phone.length < 10) err.phone = 'Valid phone required'
    if (!form.bikeNumber.trim()) err.bikeNumber = 'Bike number required'
    if (!form.problem.trim()) err.problem = 'Problem description required'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const job = {
      id: generateJobId(),
      ...form,
      bikeNumber: form.bikeNumber.toUpperCase().replace(/\s/g,''),
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parts: [],
      labour: 0,
      totalAmount: 0,
    }
    saveJob(job)
    nav(`/jobs/${job.id}`)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', maxWidth:'580px', animation:'fadeInUp 0.4s ease' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <button onClick={() => nav(-1)} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)', borderRadius:'var(--radius-md)', padding:'8px 12px', cursor:'pointer', fontSize:'13px' }}>← Back</button>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>New Job Card</h1>
          <p style={{ fontSize:'12px', color:'var(--text-secondary)' }}>Fill in customer and bike details</p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>

        {/* Customer Details */}
        <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--orange)' }}>👤 Customer Details</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Customer Name <span style={{ color:'var(--red)' }}>*</span></label>
            <input
              style={{ ...inputStyle, borderColor: errors.customerName ? 'var(--red)' : 'var(--border)' }}
              value={form.customerName}
              onChange={set('customerName')}
              placeholder="Nithin Kumar"
            />
            {errors.customerName && <span style={{ fontSize:'11px', color:'var(--red)' }}>{errors.customerName}</span>}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Phone Number <span style={{ color:'var(--red)' }}>*</span></label>
            <input
              style={{ ...inputStyle, borderColor: errors.phone ? 'var(--red)' : 'var(--border)' }}
              value={form.phone}
              onChange={set('phone')}
              placeholder="9876543210"
              type="tel"
            />
            {errors.phone && <span style={{ fontSize:'11px', color:'var(--red)' }}>{errors.phone}</span>}
          </div>
        </div>

        {/* Bike Details */}
        <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--orange)', borderTop:'1px solid var(--border)', paddingTop:'16px' }}>🏍️ Bike Details</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Bike Number <span style={{ color:'var(--red)' }}>*</span></label>
            <input
              style={{ ...inputStyle, borderColor: errors.bikeNumber ? 'var(--red)' : 'var(--border)' }}
              value={form.bikeNumber}
              onChange={set('bikeNumber')}
              placeholder="AP31XX1234"
            />
            {errors.bikeNumber && <span style={{ fontSize:'11px', color:'var(--red)' }}>{errors.bikeNumber}</span>}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Bike Model</label>
            <select
              style={{ ...inputStyle }}
              value={form.bikeModel}
              onChange={set('bikeModel')}
            >
              {BIKE_TYPES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Problem */}
        <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--orange)', borderTop:'1px solid var(--border)', paddingTop:'16px' }}>🔧 Service Details</div>

        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <label style={labelStyle}>Problem <span style={{ color:'var(--red)' }}>*</span></label>

          {/* Quick select buttons */}
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {COMMON_PROBLEMS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, problem: p }))}
                style={{
                  fontSize:'11px', padding:'4px 10px', borderRadius:'20px',
                  border:'1px solid var(--border)',
                  background: form.problem === p ? 'var(--orange-dim)' : 'var(--bg-elevated)',
                  color: form.problem === p ? 'var(--orange)' : 'var(--text-secondary)',
                  cursor:'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            style={{
              ...inputStyle,
              borderColor: errors.problem ? 'var(--red)' : 'var(--border)',
              resize:'vertical',
              minHeight:'80px',
            }}
            value={form.problem}
            onChange={set('problem')}
            placeholder="Describe the problem in detail..."
            rows={3}
          />
          {errors.problem && <span style={{ fontSize:'11px', color:'var(--red)' }}>{errors.problem}</span>}
        </div>

        {/* Estimated cost + date */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Estimated Cost (₹)</label>
            <input
              style={inputStyle}
              value={form.estimatedCost}
              onChange={set('estimatedCost')}
              placeholder="500"
              type="number"
            />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            <label style={labelStyle}>Ready By Date</label>
            <input
              style={inputStyle}
              value={form.estimatedDate}
              onChange={set('estimatedDate')}
              type="date"
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={labelStyle}>Additional Notes</label>
          <input
            style={inputStyle}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Any extra info..."
          />
        </div>

      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{ background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'14px', fontSize:'14px', fontWeight:'700', cursor:'pointer', boxShadow:'0 0 24px var(--orange-glow)' }}
      >
        Create Job Card →
      </button>

    </div>
  )
}
