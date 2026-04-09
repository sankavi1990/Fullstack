import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import SmartFormPage from './pages/SmartFormPage'
import ProductSearch from './pages/ProductSearch'
import ChatPage from './pages/ChatPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RegisterPage from './pages/RegisterPage'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/smart-form" element={
          <ProtectedRoute><SmartFormPage /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute><ProductSearch /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App