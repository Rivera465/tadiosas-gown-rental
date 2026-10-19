import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CollectionPage from './components/CollectionPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Promotional single-page home (splash + hero + gallery + styles). */}
        <Route path="/" element={<App />} />
        {/* Dedicated full catalog, separate from the promo home. */}
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
