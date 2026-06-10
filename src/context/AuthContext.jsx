import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('tlms_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('tlms_user')
      if (stored) setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  function login(tokenValue, userData) {
    localStorage.setItem('tlms_token', tokenValue)
    localStorage.setItem('tlms_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('tlms_token')
    localStorage.removeItem('tlms_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}