import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BookingModal from '../../components/dashboard/BookingModal';
import { 
  Plus, Clock, CheckCircle2, AlertTriangle, 
  User, RefreshCw, Phone, Stethoscope, ChevronRight 
} from 'lucide-react';

const ReceptionDesk = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('');
  const [doctors, setDoctors] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queueRes, statsRes, docsRes] = await Promise.all([
        api.get(`/appointments/today/queue${selectedDoctorFilter ? `?doctorId=${selectedDoctorFilter}` : ''}`),
        api.get('/dashboard/stats'),
        api.get('/doctors'),
      ]);

      if (queueRes.data.success) setAppointments(queueRes.data.appointments);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (docsRes.data.success) setDoctors(docsRes.data.doctors);
    } catch (err) {
      console.error('Error fetching desk data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDoctorFilter]);

  // Update status
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((app) => (app._id === appointmentId ? res.data.appointment : app))
        );
        // Refresh counts
        const statsRes = await api.get('/dashboard/stats');
        if (statsRes.data.success) setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'WAITING':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">Waiting in Lobby</span>;
      case 'IN_CONSULTATION':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">In Consultation</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-100 text-slate-500 border border-slate-200">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Today's Reception Queue Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live patient queue, token management, and instant telephone/walk-in intake.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Book Walk-in / Phone Call</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Today's Total Queue</span>
          <span className="text-2xl font-extrabold text-slate-900">{stats?.todayAppointments || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 block mb-1">Waiting in Waiting Area</span>
          <span className="text-2xl font-extrabold text-amber-600">{stats?.waitingQueueCount || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 block mb-1">Completed Visits</span>
          <span className="text-2xl font-extrabold text-emerald-600">{stats?.completedTodayCount || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-semibold text-sky-600 block mb-1">Active Doctors</span>
          <span className="text-2xl font-extrabold text-sky-600">{stats?.activeDoctors || 0}</span>
        </div>
      </div>

      {/* Filter by Doctor */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Doctor:</span>
        <select
          value={selectedDoctorFilter}
          onChange={(e) => setSelectedDoctorFilter(e.target.value)}
          className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Practitioners</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.fullName}</option>
          ))}
        </select>
      </div>

      {/* Queue Cards Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3">Loading live queue...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No appointments scheduled for today</h3>
          <p className="text-xs text-slate-400 mt-1">Use the "Book Walk-in / Phone Call" button above to add patients.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {appointments.map((app) => (
            <div
              key={app._id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                app.status === 'IN_CONSULTATION'
                  ? 'border-sky-500 ring-2 ring-sky-100'
                  : 'border-slate-100'
              }`}
            >
              <div>
                {/* Card Top: Token & Time */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{app.tokenNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {app.timeSlot}
                    </span>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                {/* Patient Information */}
                <div className="space-y-1 mb-4">
                  <div className="text-base font-bold text-slate-900">
                    {app.patient?.fullName}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>{app.patient?.gender}, {app.patient?.age} yrs</span>
                    <span>•</span>
                    <span className="font-mono">{app.patient?.phone}</span>
                  </div>
                </div>

                {/* Doctor Assigned & Reason */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-semibold text-slate-800">{app.doctor?.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Intake:</span>
                    <span className="font-semibold text-slate-700 capitalize">
                      {app.bookingChannel === 'PHONE_CALL' ? '📞 Telephone' : '🚶 Walk-In'}
                    </span>
                  </div>
                  {app.reasonForVisit && (
                    <div className="text-slate-600 pt-1 text-[11px] italic">
                      "{app.reasonForVisit}"
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {app.status === 'WAITING' && (
                  <button
                    onClick={() => handleStatusChange(app._id, 'IN_CONSULTATION')}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition"
                  >
                    Call to Doctor
                  </button>
                )}

                {app.status === 'IN_CONSULTATION' && (
                  <button
                    onClick={() => handleStatusChange(app._id, 'COMPLETED')}
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                  >
                    Mark Completed
                  </button>
                )}

                {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(app._id, 'CANCELLED')}
                    className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fast Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingSuccess={() => fetchData()}
      />
    </div>
  );
};

export default ReceptionDesk;
