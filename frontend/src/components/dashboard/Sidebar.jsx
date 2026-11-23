import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, Users, CalendarCheck, Stethoscope, 
  UserCheck, LogOut, LayoutDashboard, Clock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Reception Desk', path: '/dashboard', icon: Clock, end: true },
    { name: 'Appointments', path: '/dashboard/appointments', icon: CalendarCheck },
    { name: 'Patient Directory', path: '/dashboard/patients', icon: Users },
    { name: 'Doctors & Shifts', path: '/dashboard/doctors', icon: Stethoscope },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Staff Accounts', path: '/dashboard/staff', icon: UserCheck });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight block leading-tight">
            St. Jude Desk
          </span>
          <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
            Management Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Clinical Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 mb-3 flex items-center justify-between">
          <div className="truncate mr-2">
            <div className="text-xs font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">{user?.role}</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
