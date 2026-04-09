function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🎉 Welcome to Dashboard!</h2>
        <p style={styles.msg}>
          You are successfully logged in with JWT Authentication.
        </p>
        <div style={styles.badge}>
          ✅ JWT Token Active
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '90vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white', padding: '2rem',
    borderRadius: '10px', textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  msg: { color: '#555', margin: '1rem 0' },
  badge: {
    display: 'inline-block', padding: '8px 16px',
    backgroundColor: '#dcfce7', color: '#16a34a',
    borderRadius: '20px', fontSize: '14px',
    fontWeight: 'bold'
  }
}

export default Dashboard