import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import SuccessPage from './pages/SuccessPage';
import FailurePage from './pages/FailurePage';
import OTPPage from './pages/OTPPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaymentPage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/failure" element={<FailurePage />} />
      <Route path="/otp" element={<OTPPage />} />
    </Routes>
  );
}

export default App;