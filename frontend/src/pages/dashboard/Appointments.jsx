import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Search, Filter } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFilter) params.append('date', dateFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/appointments?${params.toString()}`);
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [dateFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Appointments Archive</h1>
          <p className="text-xs text-slate-500 mt-1">Review, search, and audit all clinic consultations.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="WAITING">Waiting</option>
            <option value="IN_CONSULTATION">In Consultation</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">Date / Slot</th>
                <th className="py-3.5 px-6">Token</th>
                <th className="py-3.5 px-6">Patient</th>
                <th className="py-3.5 px-6">Doctor</th>
                <th className="py-3.5 px-6">Channel</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Booked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">No appointments matching selected filters.</td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      <div>{app.appointmentDate}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{app.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-sky-600">
                      #{app.tokenNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{app.patient?.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{app.patient?.phone}</div>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {app.doctor?.fullName}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="capitalize">{app.bookingChannel === 'PHONE_CALL' ? 'Phone' : 'Walk-in'}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {app.bookedBy?.name || 'Reception'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
