import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { getSettings, getStats } from '../utils/storage.js'

const NAV = [
  { to:'/',          icon:'◉', label:'Dashboard'  },
  { to:'/jobs',      icon:'◈', label:'Jobs'        },
  { to:'/inventory', icon:'▣', label:'Inventory'   },
  { to:'/settings',  icon:'⚙', label:'Settings'    },
]

function Layout() {
  const s    = getSettings()
  const stats= getStats()
  const nav  = useNavigate()

  return (
    <div style={l.root}>
      {/* Sidebar */}
      <aside style={l.sidebar}>
        {/* Logo */}
        <div style={l.logo}>
          <div style={l.logoIcon}>🔧</div>
          <div>
            <div style={l.logoName}>{s.shopName}</div>
            <div style={l.logoSub}>Service Manager</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={l.nav}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...l.navItem,
                background:  isActive ? 'var(--orange-dim)' : 'transparent',
                color:       isActive ? 'var(--orange)'     : 'var(--text-secondary)',
                borderColor: isActive ? 'rgba(255,107,43,0.3)' : 'transparent',
              })}
            >
              <span style={l.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick stats */}
        <div style={l.sideStats}>
          {[
            { label:'Active Jobs',  value: stats.activeJobs, color:'var(--amber)'  },
            { label:'Ready',        value: stats.readyJobs,  color:'var(--green)'  },
            { label:"Today's ₹",    value:`₹${stats.todayIncome}`, color:'var(--orange)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={l.sideStat}>
              <div style={l.sideStatLabel}>{label}</div>
              <div style={{ ...l.sideStatValue, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* New Job button */}
        <button onClick={() => nav('/jobs/new')} style={l.newJobBtn}>
          + New Job
        </button>
      </aside>

      {/* Main content */}
      <main style={l.main}>
        <Outlet />
      </main>
    </div>
  )
}

const l = {
  root:    { display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)' },
  sidebar: { width:'220px', flexShrink:0, background:'var(--bg-card)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'20px 12px', gap:'8px', overflowY:'auto' },
  logo:    { display:'flex', alignItems:'center', gap:'10px', padding:'4px 8px 16px', borderBottom:'1px solid var(--border)', marginBottom:'8px' },
  logoIcon:{ fontSize:'24px' },
  logoName:{ fontSize:'14px', fontWeight:'600', color:'var(--text-primary)', lineHeight:1.2 },
  logoSub: { fontSize:'10px', color:'var(--text-tertiary)', letterSpacing:'0.06em' },
  nav:     { display:'flex', flexDirection:'column', gap:'2px', flex:1 },
  navItem: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'var(--radius-md)', border:'1px solid transparent', textDecoration:'none', fontSize:'13px', fontWeight:'500', transition:'all 0.15s ease' },
  navIcon: { fontSize:'14px', width:'16px', textAlign:'center' },
  sideStats:{ display:'flex', flexDirection:'column', gap:'6px', padding:'12px 8px', background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', margin:'8px 0' },
  sideStat: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  sideStatLabel: { fontSize:'11px', color:'var(--text-tertiary)' },
  sideStatValue: { fontSize:'13px', fontWeight:'600', fontFamily:'var(--font-mono)' },
  newJobBtn:{ background:'var(--orange)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', textAlign:'center', boxShadow:'0 0 20px var(--orange-glow)', marginTop:'auto' },
  main:    { flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:'20px' },
}

export default Layout
