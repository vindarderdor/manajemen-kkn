import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { BookOpen } from 'lucide-react' // Placeholder for logo

export default function AuthLayout() {
  const { session, isLoading } = useAuthStore()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-unair-blue text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-unair-blue to-blue-900 opacity-90 z-0"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-12 h-12 text-unair-gold" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">BBK 8 UNAIR</h1>
          <h2 className="text-2xl font-semibold text-unair-gold mb-6">GUNDIH 1</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Sistem Manajemen dan Monitoring Kegiatan Kuliah Kerja Nyata Universitas Airlangga
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-unair-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
             <div className="w-16 h-16 bg-unair-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-unair-gold" />
             </div>
             <h1 className="text-2xl font-bold text-slate-900">BBK 8 UNAIR</h1>
             <p className="text-sm text-slate-500">Sistem Manajemen KKN</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
