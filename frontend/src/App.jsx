import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ArtistDashboard from './pages/ArtistDashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import './App.css'
import './theme.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/artistdashboard">Artist Dashboard</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artistdashboard" element={<ArtistDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
