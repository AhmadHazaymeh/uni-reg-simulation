import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DataEntryDashboard from './pages/DataEntryDashboard'; 
import StudentDashboard from './pages/StudentDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';

import AdminDashboard from './pages/AdminDashboard'; 
import HoDDashboard from './pages/HoDDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<LandingPage />} />
        
        {/* بوابة الدخول الموحدة لكادر الجامعة (أدمن، رئيس قسم، مدخل بيانات) */}
        <Route path="/login" element={<Login />} />
        
        {/* مسارات لوحات التحكم حسب الرول */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/hod-dashboard/*" element={<HoDDashboard />} />
        
        {/* واجهة مدخل البيانات (التي كانت تسمى DataEntryDashboard) */}
        {/* ملاحظة: سنبقيها كما هي حالياً لتجنب كسر الروابط القديمة */}
        <Route path="/data-entry/*" element={<DataEntryDashboard />} />
        
        {/* بوابة الطلاب */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;