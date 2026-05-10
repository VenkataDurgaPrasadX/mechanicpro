const JOBS_KEY     = 'mechanicpro_jobs'
const PARTS_KEY    = 'mechanicpro_parts'
const SETTINGS_KEY = 'mechanicpro_settings'

export const STATUS = {
  RECEIVED: 'received',
  WORKING:  'working',
  READY:    'ready',
  DELIVERED:'delivered',
}

export const STATUS_LABELS = {
  received:  'Received',
  working:   'Working',
  ready:     'Ready ✓',
  delivered: 'Delivered',
}

export const STATUS_COLORS = {
  received:  { bg:'var(--blue-dim)',    text:'var(--blue)',          border:'rgba(59,130,246,0.3)'  },
  working:   { bg:'var(--amber-dim)',   text:'var(--amber)',         border:'rgba(245,158,11,0.3)'  },
  ready:     { bg:'var(--green-dim)',   text:'var(--green)',         border:'rgba(34,197,94,0.3)'   },
  delivered: { bg:'var(--bg-elevated)', text:'var(--text-tertiary)', border:'var(--border)'         },
}

export function getJobs() {
  try { return JSON.parse(localStorage.getItem(JOBS_KEY)) || [] }
  catch { return [] }
}

export function saveJob(job) {
  const jobs = getJobs()
  const idx  = jobs.findIndex(j => j.id === job.id)
  if (idx >= 0) jobs[idx] = job
  else jobs.unshift(job)
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
  return job
}

export function deleteJob(id) {
  const jobs = getJobs().filter(j => j.id !== id)
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
}

export function getJobById(id) {
  return getJobs().find(j => j.id === id) || null
}

export function generateJobId() {
  return 'JOB' + Date.now().toString(36).toUpperCase()
}

export function getParts() {
  try { return JSON.parse(localStorage.getItem(PARTS_KEY)) || getDefaultParts() }
  catch { return getDefaultParts() }
}

export function saveParts(parts) {
  localStorage.setItem(PARTS_KEY, JSON.stringify(parts))
}

function getDefaultParts() {
  return [
    { id:'p1', name:'Engine Oil (1L)',  price:450, stock:10, minStock:3, category:'Oil'     },
    { id:'p2', name:'Oil Filter',       price:120, stock:8,  minStock:3, category:'Filter'  },
    { id:'p3', name:'Air Filter',       price:180, stock:5,  minStock:2, category:'Filter'  },
    { id:'p4', name:'Spark Plug',       price:90,  stock:15, minStock:5, category:'Ignition'},
    { id:'p5', name:'Brake Pads (Set)', price:350, stock:4,  minStock:2, category:'Brakes'  },
    { id:'p6', name:'Chain Kit',        price:650, stock:3,  minStock:2, category:'Drive'   },
    { id:'p7', name:'Clutch Cable',     price:80,  stock:6,  minStock:3, category:'Control' },
    { id:'p8', name:'Brake Cable',      price:70,  stock:6,  minStock:3, category:'Control' },
  ]
}

export function getSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    if (saved) return saved
    return getDefaultSettings()
  } catch {
    return getDefaultSettings()
  }
}

function getDefaultSettings() {
  return {
    shopName:  "Nithin's Garage",
    ownerName: "Goddati Nithin",
    phone:     "9876543210",
    address:   "P. Kokilampadu, Tiruvuru",
    gst:       18,
    upiId:     "nithin@upi",
  }
}

export function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

export function getStats() {
  const jobs   = getJobs()
  const today  = new Date().toDateString()
  const todayJobs   = jobs.filter(j => new Date(j.createdAt).toDateString() === today)
  const activeJobs  = jobs.filter(j => j.status !== STATUS.DELIVERED)
  const readyJobs   = jobs.filter(j => j.status === STATUS.READY)
  const todayIncome = todayJobs
    .filter(j => j.status === STATUS.DELIVERED)
    .reduce((sum, j) => sum + (j.totalAmount || 0), 0)
  const weekIncome  = jobs
    .filter(j => {
      const diff = (new Date() - new Date(j.createdAt)) / (1000*60*60*24)
      return diff <= 7 && j.status === STATUS.DELIVERED
    })
    .reduce((sum, j) => sum + (j.totalAmount || 0), 0)

  return {
    todayJobs:   todayJobs.length,
    activeJobs:  activeJobs.length,
    readyJobs:   readyJobs.length,
    todayIncome,
    weekIncome,
    totalJobs:   jobs.length,
  }
}
