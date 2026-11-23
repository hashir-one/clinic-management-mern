import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ReceptionDesk from './pages/dashboard/ReceptionDesk';
import Appointments from './pages/dashboard/Appointments';
import Patients from './pages/dashboard/Patients';
import Doctors from './pages/dashboard/Doctors';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Clinic Management Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<ReceptionDesk />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
