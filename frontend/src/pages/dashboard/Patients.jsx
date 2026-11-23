import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, UserPlus, Phone, User, Calendar } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New patient state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [address, setAddress] = useState('');

  const fetchPatients = async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/patients?search=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setPatients(res.data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(searchTerm);
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/patients', {
        fullName,
        phone,
        age: Number(age),
        gender,
        bloodGroup,
        address,
      });

      if (res.data.success) {
        setPatients([res.data.patient, ...patients]);
        setShowAddModal(false);
        setFullName('');
        setPhone('');
        setAge('');
        setAddress('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create patient');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of registered clinic patients and contact details.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by phone number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
        >
          Search
        </button>
      </form>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Age / Gender</th>
                <th className="py-3.5 px-6">Blood Group</th>
                <th className="py-3.5 px-6">Address</th>
                <th className="py-3.5 px-6">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">No patients found.</td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {p.fullName}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {p.phone}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {p.age} yrs • {p.gender}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">
                      {p.bloodGroup}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 max-w-xs truncate">
                      {p.address || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register New Patient</h3>
            <form onSubmit={handleCreatePatient} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  {['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                />
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
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
