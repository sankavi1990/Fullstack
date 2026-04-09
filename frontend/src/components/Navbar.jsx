import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('access_token')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  // Hide navbar on login page
  if (location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register') {
  return null
}

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        🚀 Fullstack Evaluation
      </div>
      <div style={styles.links}>
        <a href="/dashboard" style={styles.navLink}>Dashboard</a>
        <a href="/smart-form" style={styles.navLink}>Smart Form</a>
        <a href="/products" style={styles.navLink}>Products</a>
         <a href="/chat" style={styles.navLink}>AI Chat</a>
        {token && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '1rem 2rem',
    backgroundColor: '#4f46e5', color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  navLink: {
  color: 'white', textDecoration: 'none',
  fontSize: '20px', fontWeight: '500'
},
  brand: { fontSize: '1.3rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '6px',
    fontSize: '18px', cursor: 'pointer'
  }
}

export default Navbar