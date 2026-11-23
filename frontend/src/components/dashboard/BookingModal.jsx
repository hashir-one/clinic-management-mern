import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  X, Search, UserPlus, Calendar, Clock, 
  Stethoscope, AlertCircle, CheckCircle, Phone 
} from 'lucide-react';

const BookingModal = ({ isOpen, onClose, onBookingSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  // New patient state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Male');

  // Booking fields
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingChannel, setBookingChannel] = useState('WALK_IN');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch active doctors on open
  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        try {
          const res = await api.get('/doctors');
          if (res.data.success) {
            setDoctors(res.data.doctors);
            if (res.data.doctors.length > 0) {
              setSelectedDoctorId(res.data.doctors[0]._id);
            }
          }
        } catch (err) {
          console.error('Error fetching doctors:', err);
        }
      };
      fetchDoctors();
    }
  }, [isOpen]);

  // Search patient by phone/name
  const handleSearchPatient = async (e) => {
    e?.preventDefault();
    if (!searchPhone.trim()) return;

    setIsSearching(true);
    setError('');
    try {
      const res = await api.get(`/patients?search=${encodeURIComponent(searchPhone.trim())}`);
      if (res.data.success) {
        setPatients(res.data.patients);
        if (res.data.patients.length === 1) {
          setSelectedPatient(res.data.patients[0]);
        }
      }
    } catch (err) {
      setError('Error searching patient.');
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Register New Patient
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newName || !newPhone || !newAge) {
      setError('Please fill in patient name, phone, and age');
      return;
    }

    try {
      const res = await api.post('/patients', {
        fullName: newName,
        phone: newPhone,
        age: Number(newAge),
        gender: newGender,
      });

      if (res.data.success) {
        setSelectedPatient(res.data.patient);
        setShowNewPatientForm(false);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient');
    }
  };

  // Fetch available slots whenever doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !appointmentDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot('');
      try {
        const res = await api.get(`/doctors/${selectedDoctorId}/slots?date=${appointmentDate}`);
        if (res.data.success) {
          setTimeSlots(res.data.slots || []);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctorId, appointmentDate]);

  // Submit Appointment
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPatient) {
      setError('Please select or register a patient first.');
      return;
    }
    if (!selectedSlot) {
      setError('Please select an available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        patientId: selectedPatient._id,
        doctorId: selectedDoctorId,
        appointmentDate,
        timeSlot: selectedSlot,
        bookingChannel,
        reasonForVisit,
      });

      if (res.data.success) {
        onBookingSuccess(res.data.appointment);
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setPatients([]);
    setSearchPhone('');
    setShowNewPatientForm(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold">Receptionist Quick Booking Desk</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Patient Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Select Patient
              </label>
              {!showNewPatientForm && (
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPatientForm(true);
                    setSelectedPatient(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Quick Register New</span>
                </button>
              )}
            </div>

            {selectedPatient ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{selectedPatient.fullName} ({selectedPatient.age} yrs, {selectedPatient.gender})</span>
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">Phone: {selectedPatient.phone}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                >
                  Change
                </button>
              </div>
            ) : showNewPatientForm ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">New Patient Details</span>
                  <button
                    type="button"
                    onClick={() => setShowNewPatientForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleCreatePatient}
                  className="w-full py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                >
                  Save & Select Patient
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Lookup patient by phone or name..."
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient(e)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchPatient}
                    disabled={isSearching}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {patients.length > 0 && (
                  <div className="border border-slate-100 rounded-xl divide-y max-h-36 overflow-y-auto">
                    {patients.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => setSelectedPatient(p)}
                        className="p-2.5 text-xs hover:bg-sky-50 cursor-pointer flex justify-between items-center transition"
                      >
                        <span className="font-semibold text-slate-800">{p.fullName}</span>
                        <span className="text-slate-500">{p.phone} ({p.gender}, {p.age}y)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Doctor and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                2. Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.fullName} - {d.specialization} (${d.consultationFee})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Appointment Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          {/* STEP 3: Available Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Choose Time Slot
              </label>
              <span className="text-[11px] text-slate-400">
                {timeSlots.filter((s) => s.isAvailable).length} slots available
              </span>
            </div>

            {loadingSlots ? (
              <div className="text-xs text-slate-400 py-3 text-center">Calculating doctor shifts & available slots...</div>
            ) : timeSlots.length === 0 ? (
              <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                No slots found. Doctor may not consult on this date.
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                {timeSlots.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition ${
                      selectedSlot === slot.time
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : slot.isAvailable
                        ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 4: Channel & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Intake Channel
              </label>
              <select
                value={bookingChannel}
                onChange={(e) => setBookingChannel(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="WALK_IN">In-Person Walk-in</option>
                <option value="PHONE_CALL">Telephone Call</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Chief Complaint / Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Fever, routine follow-up"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmitBooking}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition disabled:opacity-50"
          >
            {submitting ? 'Confirming Booking...' : 'Confirm & Generate Token'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
