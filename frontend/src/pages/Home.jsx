import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import { 
  Calendar, Clock, Award, ShieldCheck, HeartPulse, 
  Stethoscope, UserCheck, PhoneCall, ChevronRight 
} from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
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

    fetchDoctors();
  }, []);

  const specialties = [
    { name: 'General Medicine', icon: Stethoscope, desc: 'Comprehensive diagnostics, chronic care, preventive screenings' },
    { name: 'Cardiology', icon: HeartPulse, desc: 'ECG, echocardiography, blood pressure control, heart health' },
    { name: 'Pediatrics', icon: UserCheck, desc: 'Newborn checkups, child immunizations, developmental care' },
    { name: 'Orthopedics & Sports Care', icon: Award, desc: 'Joint treatments, fracture care, bone density analysis' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Accredited Medical Center
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Compassionate Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">
                  Exceptional Doctors.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                St. Jude Clinic delivers personalized outpatient diagnostics and trusted family healthcare. Our dedicated reception desk coordinates seamless doctor consultations with zero waiting hassle.
              </p>

              {/* Call to Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <a
                  href="tel:+18005550199"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02]"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Call to Schedule: (800) 555-0199</span>
                </a>
                <a
                  href="#doctors"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <span>View Doctors & Shifts</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Quick Clinic Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">12+</div>
                  <div className="text-xs font-medium text-slate-500">Senior Specialists</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">20 min</div>
                  <div className="text-xs font-medium text-slate-500">Avg Consultation</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs font-medium text-slate-500">Reception Verified</div>
                </div>
              </div>
            </div>

            {/* Right Card: Reception Desk Notice */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Reception Desk Booking</h3>
                    <p className="text-xs text-slate-500">Live queue management & scheduling</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <p><strong>Call or Walk In:</strong> Reach our reception desk with your phone number or visit in person.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <p><strong>Immediate Slot Allocation:</strong> Receptionist confirms active doctor availability and issues your unique token.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <p><strong>Consult with Ease:</strong> Track live queue board in the clinic lobby with zero double-booking delays.</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-600">Reception Open Today:</span>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                    08:00 AM - 08:00 PM
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-sky-600 tracking-wider uppercase mb-2">Our Clinical Services</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Specialized Care For You and Your Family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialties.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-5 shadow-md shadow-sky-600/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctor Directory Section */}
      <section id="doctors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-teal-600 tracking-wider uppercase mb-2">Practitioners & Timings</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Meet Our Certified Specialists
            </p>
            <p className="text-slate-500 text-sm mt-3">
              Consultation shifts and working days are managed directly with our reception desk.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-8">
              <p className="text-slate-600 font-medium">Doctor directory initializing...</p>
              <p className="text-xs text-slate-400 mt-1">Please log into the staff portal to configure doctors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doc) => (
                <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{doc.fullName}</h3>
                        <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md mt-1">
                          {doc.specialization} ({doc.department})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Consultation</span>
                        <span className="text-base font-extrabold text-slate-800">${doc.consultationFee}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{doc.bio}</p>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-700">Days:</span>
                        <span>{doc.workingDays?.join(', ') || 'Mon - Sat'}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-700">Morning Shift:</span>
                        <span>{doc.shifts?.morning?.enabled ? `${doc.shifts.morning.start} - ${doc.shifts.morning.end}` : 'None'}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-700">Evening Shift:</span>
                        <span>{doc.shifts?.evening?.enabled ? `${doc.shifts.evening.start} - ${doc.shifts.evening.end}` : 'None'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <a
                      href="tel:+18005550199"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Book Slot via Desk</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-sky-600 tracking-wider uppercase">Our Mission</h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Modern Healthcare Grounded in Personal Attention
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                St. Jude Clinic was founded on a simple premise: patients should spend their time receiving attentive medical care, not navigating broken online queues. Our receptionist team manages patient intake in real-time, giving every family prompt access to certified doctors and dedicated medical follow-ups.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">Real-Time Tokens</div>
                  <div className="text-xs text-slate-500 mt-1">Live lobby queue numbers update automatically.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">Direct Staff Care</div>
                  <div className="text-xs text-slate-500 mt-1">Receptionist verifies every slot to eliminate delays.</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-sky-600 to-teal-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-sky-600/20 space-y-6">
              <h3 className="text-2xl font-bold">Need Immediate Assistance?</h3>
              <p className="text-sky-100 text-sm leading-relaxed">
                Our front desk team is ready to answer questions regarding medical records, specialty doctors on duty, and consultation appointments.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">📞</div>
                  <div>
                    <div className="text-xs text-sky-100">Direct Phone Line</div>
                    <div className="font-bold text-lg">+1 (800) 555-0199</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">📍</div>
                  <div>
                    <div className="text-xs text-sky-100">Clinic Location</div>
                    <div className="font-semibold text-sm">Suite 400, Medical Plaza, Metro City</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
