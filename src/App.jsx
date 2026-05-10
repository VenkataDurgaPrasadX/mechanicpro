import { Routes, Route, Navigate } from 'react-router-dom'
import Layout    from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Jobs      from './pages/Jobs.jsx'
import NewJob    from './pages/NewJob.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Billing   from './pages/Billing.jsx'
import Inventory from './pages/Inventory.jsx'
import TrackBike from './pages/TrackBike.jsx'
import Settings  from './pages/Settings.jsx'

function App() {
  return (
    <Routes>
      <Route path="track/:jobId" element={<TrackBike />} />
      <Route element={<Layout />}>
        <Route index             element={<Dashboard />} />
        <Route path="jobs"       element={<Jobs />} />
        <Route path="jobs/new"   element={<NewJob />} />
        <Route path="jobs/:id"   element={<JobDetail />} />
        <Route path="billing/:id" element={<Billing />} />
        <Route path="inventory"  element={<Inventory />} />
        <Route path="settings"   element={<Settings />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}
export default App
