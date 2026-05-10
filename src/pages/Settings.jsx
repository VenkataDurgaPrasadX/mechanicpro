import { useState } from 'react'
import { getSettings, saveSettings } from '../utils/storage.js'

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

export default function Settings() {
  const [form, setSaved_] = useState(getSettings())
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setSaved_(p => ({ ...p, [k]: e.target.value }))

  const save = () => {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px', maxWidth:'500px', animation:'fadeInUp 0.4s ease' }}>
      <h1 style={{ fontSize:'20px', fontWeight:'700', color:'var(--text-primary)' }}>Shop Settings</h1>

      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'24px', display:'flex', flexDirection:'column', gap:'14px' }}>
        <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--orange)', marginBottom:'4px' }}>🏪 Shop Information</div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)' }}>Shop Name</label>
          <input style={inputStyle} value={form.shopName||''} onChange={set('shopName')} placeholder="NitroFix Garage" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)' }}>Owner Name</label>
          <input style={inputStyle} value={form.ownerName||''} onChange={set('ownerName')} placeholder="Nithin" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)' }}>Phone Number</label>
          <input style={inputStyle} value={form.phone||''} onChange={set('phone')} placeholder="9876543210" type="tel" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)' }}>Address</label>
          <input style={inputStyle} value={form.address||''} onChange={set('address')} placeholder="Area, City" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <label style={{ fontSize:'12px', fontWeight:'500', color:'var(--text-secondary)' }}>UPI ID</label>
          <input style={inputStyle} value={form.upiId||''} onChange={set('upiId')} placeholder="nithin@upi" />
        </div>

        <button
          onClick={save}
          style={{ background: saved ? 'var(--green)' : 'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer', transition:'background 0.3s ease', marginTop:'8px' }}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
