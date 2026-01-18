import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DataEntryDashboard from './pages/DataEntryDashboard'; 
import StudentDashboard from './pages/StudentDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';

function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<LandingPage />} />
        
        {/**/}
        <Route path="/login" element={<Login />} />
        <Route path="/data-entry/*" element={<DataEntryDashboard />} />
        
        {/*  الطلاب */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;