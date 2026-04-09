import { useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation()

  // Hide footer on login page
 if (location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register') {
  return null
}

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © 2025 Fullstack Evaluation — Built with Django + React
      </p>
    </footer>
  )
}

const styles = {
  footer: {
    textAlign: 'center', padding: '1rem',
    backgroundColor: '#4f46e5', color: 'white',
    position: 'fixed', bottom: 0, width: '100%'
  },
  text: { margin: 0, fontSize: '14px' }
}

export default Footer