import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Plus, Clock, DollarSign, Calendar } from 'lucide-react';

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [department, setDepartment] = useState('General Medicine');
  const [consultationFee, setConsultationFee] = useState('300');
  const [bio, setBio] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors', {
        fullName,
        email,
        phone,
        specialization,
        department,
        consultationFee: Number(consultationFee),
        bio,
      });

      if (res.data.success) {
        setDoctors([...doctors, res.data.doctor]);
        setShowAddModal(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setSpecialization('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Doctors & Shift Schedules</h1>
          <p className="text-xs text-slate-500 mt-1">Manage practitioner consultation shifts and consulting fees.</p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Doctor</span>
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-400">No doctors added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{doc.fullName}</h3>
                    <div className="text-xs text-sky-600 font-semibold mt-0.5">
                      {doc.specialization} ({doc.department})
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                    ${doc.consultationFee}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Days: {doc.workingDays?.join(', ') || 'All Days'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Morning: {doc.shifts?.morning?.start} - {doc.shifts?.morning?.end}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Evening: {doc.shifts?.evening?.start} - {doc.shifts?.evening?.end}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Doctor Profile</h3>
            <form onSubmit={handleAddDoctor} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Gregory House"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiologist"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Consultation Fee ($)</label>
                  <input
                    type="number"
                    required
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-lg hover:bg-sky-700"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
