import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const params = new URLSearchParams(window.location.search)
const redirectPath = params.get('p')
if (redirectPath) {
  const query = params.get('q') ? decodeURIComponent(params.get('q')) : ''
  window.history.replaceState(null, '', decodeURIComponent(redirectPath) + query)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
