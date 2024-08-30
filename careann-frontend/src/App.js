import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CareSeekerDashboard from './pages/CareSeekerDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/care-seeker/dashboard" element={<CareSeekerDashboard />} />
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
