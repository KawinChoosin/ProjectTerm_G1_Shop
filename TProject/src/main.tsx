import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

import React from 'react'
import './reset.css';
import ProductDetail from './components/Productdetail.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* <Route path="/electronic" element={<Elec />} />
        <Route path="/cloth" element={<Cloth />} />
        <Route path="/sport" element={<Sport />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
)
