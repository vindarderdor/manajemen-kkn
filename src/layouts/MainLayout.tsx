import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  BookText,
  Image as ImageIcon,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react'

import { Home } from 'lucide-react'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Anggota', to: '/members', icon: Users },
    { name: 'Program Kerja', to: '/programs', icon: Briefcase },
    { name: 'Jadwal', to: '/schedules', icon: Calendar },
    { name: 'Jurnal Harian', to: '/journals', icon: BookText },
    { name: 'Galeri', to: '/gallery', icon: ImageIcon },
    { name: 'Laporan', to: '/reports', icon: FileText },
    { name: 'Pengumuman', to: '/announcements', icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-unair-blue text-white">
          <span className="text-lg font-bold">BBK 8 UNAIR</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mb-4 border border-slate-200"
          >
            <Home className="w-5 h-5 text-unair-gold" />
            Beranda Web
          </NavLink>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-unair-blue/10 text-unair-blue' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-900 truncate">
              {/* Could add dynamic breadcrumbs here */}
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-unair-blue/10 flex items-center justify-center text-unair-blue overflow-hidden">
              {profile?.foto ? (
                <img src={profile.foto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
