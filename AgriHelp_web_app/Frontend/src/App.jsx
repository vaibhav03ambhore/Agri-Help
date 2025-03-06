import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import GetStarted from './pages/GetStarted'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
