import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PublicMapPage from './pages/PublicMapPage'
import LoginPage from './pages/LoginPage'
import SignalementListPage from './pages/SignalementListPage'
import SignalementEditPage from './pages/SignalementEditPage'
import SyncPage from './pages/SyncPage'
import UserManagementPage from './pages/UserManagementPage'
import StatisticsPage from './pages/StatisticsPage'
import ManagerGuard from './components/ManagerGuard'
import { AuthProvider } from './context/AuthContext'
import { ReportsProvider } from './context/ReportsContext'
import UserMenu from './components/UserMenu'

export default function App(){
  return (
    <AuthProvider>
      <ReportsProvider>
        <div>
          <header className="app-header">
            <div className="brand"><Link to="/">MrRojo</Link></div>
            <nav className="nav">
              <Link to="/">Public Map</Link>
              <Link to="/login">Manager Login</Link>
              <Link to="/manager">Manager</Link>
            </nav>
            <div style={{marginLeft:12}}>
              <UserMenu />
            </div>
          </header>
          <main style={{padding:10}}>
            <Routes>
              <Route path="/" element={<PublicMapPage/>} />
              <Route path="/login" element={<LoginPage/>} />

              <Route path="/manager" element={<ManagerGuard><SignalementListPage/></ManagerGuard>} />
              <Route path="/manager/signalements" element={<ManagerGuard><SignalementListPage/></ManagerGuard>} />
              <Route path="/manager/signalements/:id" element={<ManagerGuard><SignalementEditPage/></ManagerGuard>} />
              <Route path="/manager/sync" element={<ManagerGuard><SyncPage/></ManagerGuard>} />
              <Route path="/manager/users" element={<ManagerGuard><UserManagementPage/></ManagerGuard>} />
              <Route path="/manager/stats" element={<ManagerGuard><StatisticsPage/></ManagerGuard>} />
            </Routes>
          </main>
        </div>
      </ReportsProvider>
    </AuthProvider>
  )
}
