import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, BookOpen, Calendar, Settings } from 'lucide-react';
import { Link, Routes, Route } from 'react-router-dom';

import DashboardOverview from './DashboardOverview';
import Students from './Students';
import Teachers from './Teachers';
import Courses from './Courses';
import Attendance from './Attendance';
import Marks from './Marks';
import Fees from './Fees';
import Notices from './Notices';
import Timetable from './Timetable';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Students', icon: Users, path: '/dashboard/students' },
    { name: 'Teachers', icon: Users, path: '/dashboard/teachers' },
    { name: 'Courses', icon: BookOpen, path: '/dashboard/courses' },
    { name: 'Attendance', icon: Calendar, path: '/dashboard/attendance' },
    { name: 'Marks', icon: BookOpen, path: '/dashboard/marks' },
    { name: 'Fees', icon: BookOpen, path: '/dashboard/fees' },
    { name: 'Notice Board', icon: BookOpen, path: '/dashboard/notices' },
    { name: 'Timetable', icon: Calendar, path: '/dashboard/timetable' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">EduManage</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{user?.role} Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.username}</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/settings" element={<div className="text-gray-500">Settings (To be built)</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
