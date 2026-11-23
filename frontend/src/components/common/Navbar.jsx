import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Phone, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                St. Jude <span className="text-sky-600">Clinic</span>
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Care & Diagnostics
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Specialties
            </a>
            <a href="#doctors" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Doctors & Timings
            </a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              About Clinic
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Contact & Location
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+18005550199"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Desk: (800) 555-0199</span>
            </a>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all hover:translate-y-[-1px]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Desk ({user?.role})</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-sky-600 hover:text-sky-600 transition shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
