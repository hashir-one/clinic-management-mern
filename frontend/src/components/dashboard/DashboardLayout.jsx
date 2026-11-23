import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Calendar } from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {todayFormatted}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Active Shift: 08:00 AM - 08:00 PM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">{user?.name}</div>
              <div className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                {user?.role} Active
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
