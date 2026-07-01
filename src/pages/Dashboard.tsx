import { Users, Briefcase, CalendarCheck, Image as ImageIcon } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useMembers, useWorkPrograms, useJournals, useGalleries } from '../services/api'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Dashboard() {
  const { data: members } = useMembers()
  const { data: prokers } = useWorkPrograms()
  const { data: journals } = useJournals()
  const { data: galleries } = useGalleries()

  // Dynamic Chart Data based on Work Programs progress
  // Since we don't have weeks explicitly, we can group them by Status for a meaningful chart
  const prokerSelesai = prokers?.filter(p => p.status === 'Selesai').length || 0
  const prokerBerjalan = prokers?.filter(p => p.status === 'Berjalan').length || 0
  const prokerPerencanaan = prokers?.filter(p => p.status === 'Perencanaan').length || 0
  
  const dataProker = [
    { name: 'Selesai', total: prokerSelesai },
    { name: 'Berjalan', total: prokerBerjalan },
    { name: 'Rencana', total: prokerPerencanaan },
  ]

  // Recent activities dynamically from what we have
  const recentActivities = [
    ...(prokers?.slice(0, 2).map(p => ({
      id: `p-${p.id}`,
      title: `Proker: ${p.nama} (${p.status})`,
      time: 'Baru saja',
      type: 'proker'
    })) || []),
    ...(galleries?.slice(0, 2).map(g => ({
      id: `g-${g.id}`,
      title: `Foto ditambahkan: ${g.judul}`,
      time: 'Terbaru',
      type: 'galeri'
    })) || []),
  ].slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Ringkasan aktivitas dan progres KKN BBK 8 Gundih 1</p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda (Landing Page)
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-unair-blue rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Anggota</p>
            <p className="text-2xl font-bold text-slate-900">{members?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-unair-gold rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Program Kerja</p>
            <p className="text-2xl font-bold text-slate-900">{prokers?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Jurnal Kegiatan</p>
            <p className="text-2xl font-bold text-slate-900">{journals?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Dokumentasi</p>
            <p className="text-2xl font-bold text-slate-900">{galleries?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Status Program Kerja</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataProker}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="total" name="Jumlah" fill="#003366" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Aktivitas Terbaru</h2>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">Belum ada aktivitas tercatat.</p>
          ) : (
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {index !== recentActivities.length - 1 && (
                    <div className="absolute top-8 left-2.5 w-0.5 h-full -ml-px bg-slate-200"></div>
                  )}
                  <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1
                    ${activity.type === 'proker' ? 'bg-unair-blue ring-4 ring-blue-50' : 
                      activity.type === 'galeri' ? 'bg-purple-500 ring-4 ring-purple-50' : 
                      'bg-emerald-500 ring-4 ring-emerald-50'}`} 
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
