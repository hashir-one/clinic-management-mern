import React from 'react';
import { Activity, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                St. Jude Clinic
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing patient-centered family healthcare, certified specialist consultations, and modern lab testing since 2012.
            </p>
          </div>

          {/* Col 2: Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Operating Hours
            </h4>
            <ul className="text-sm space-y-2 text-slate-400">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-semibold text-slate-200">08:00 AM - 08:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold text-slate-200">09:00 AM - 05:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-amber-400 font-semibold">Emergency Only</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400" />
              Direct Contacts
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>Reception Desk: +1 (800) 555-0199</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>appointments@stjudeclinic.local</span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>Suite 400, Medical Plaza, Metro City</span>
              </p>
            </div>
          </div>

          {/* Col 4: Reception Notice */}
          <div className="space-y-3 bg-slate-800/60 p-5 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-white">Appointment Policy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              To guarantee thorough patient evaluations and eliminate online duplicate bookings, all appointments are scheduled exclusively via our receptionist desk by phone or in-person walk-in.
            </p>
            <div className="text-xs font-semibold text-sky-400">
              Call our desk for fast slot allocation.
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} St. Jude Clinic & Diagnostics. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">MERN Stack Clinic Architecture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
