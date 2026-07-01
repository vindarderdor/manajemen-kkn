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

const dataProker = [
  { name: 'Minggu 1', selesai: 2, berjalan: 3 },
  { name: 'Minggu 2', selesai: 5, berjalan: 2 },
  { name: 'Minggu 3', selesai: 8, berjalan: 4 },
  { name: 'Minggu 4', selesai: 12, berjalan: 1 },
]

const recentActivities = [
  { id: 1, title: 'Sosialisasi Stunting di Balai Desa', time: '2 jam yang lalu', type: 'proker' },
  { id: 2, title: 'Budi mengunggah dokumentasi baru', time: '5 jam yang lalu', type: 'galeri' },
  { id: 3, title: 'Rapat koordinasi bersama DPL', time: 'Kemarin', type: 'jadwal' },
  { id: 4, title: 'Program Kerja "Bimbel Gratis" Selesai', time: '2 hari yang lalu', type: 'proker' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Ringkasan aktivitas dan progres KKN BBK 8 Gundih 1</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-unair-blue rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Anggota</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-unair-gold rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Program Kerja</p>
            <p className="text-2xl font-bold text-slate-900">8</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Jurnal Kegiatan</p>
            <p className="text-2xl font-bold text-slate-900">45</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Dokumentasi</p>
            <p className="text-2xl font-bold text-slate-900">124</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Progres Program Kerja</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataProker}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="selesai" name="Selesai" fill="#003366" radius={[4, 4, 0, 0]} />
                <Bar dataKey="berjalan" name="Berjalan" fill="#F2A900" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Aktivitas Terbaru</h2>
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
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-unair-blue hover:text-blue-900 transition-colors">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  )
}
