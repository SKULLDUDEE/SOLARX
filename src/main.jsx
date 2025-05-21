import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StartupDetail from './pages/StartupDetail.jsx'
import CompanyInformation from './components/CompanyInformation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/startup/:id" element={<StartupDetail />} />
        <Route path="/company/:companyId" element={<CompanyInformation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
