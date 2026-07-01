import { Link } from 'react-router-dom'
import { BookOpen, Users, CalendarCheck, MapPin, ChevronRight, ArrowRight, User as UserIcon } from 'lucide-react'
import { useMembers } from '../services/api'

export default function Landing() {
  const { data: members } = useMembers()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-unair-blue rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-unair-gold" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">BBK 8 UNAIR</span>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-unair-blue transition-colors">Tentang Kami</a>
              <a href="#proker" className="text-sm font-medium text-slate-600 hover:text-unair-blue transition-colors">Program Kerja</a>
              <a href="#tim" className="text-sm font-medium text-slate-600 hover:text-unair-blue transition-colors">Tim Kami</a>
              <a href="#galeri" className="text-sm font-medium text-slate-600 hover:text-unair-blue transition-colors">Galeri</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link 
                to="/login"
                className="text-sm font-medium text-unair-blue hover:text-blue-900 transition-colors"
              >
                Masuk Dashboard
              </Link>
              <Link 
                to="/login"
                className="bg-unair-blue hover:bg-blue-900 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 group"
              >
                Mulai
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-unair-blue text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-unair-blue to-blue-900 opacity-90 z-0"></div>
        <div className="absolute -bottom-48 -left-48 w-[40rem] h-[40rem] bg-unair-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-48 -right-48 w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
             <MapPin className="w-4 h-4 text-unair-gold" />
             Desa Gundih 1, Kec. Bubutan, Surabaya
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Mengabdi dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-unair-gold to-amber-300">Aksi Nyata</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Sistem Informasi dan Manajemen Kegiatan Kuliah Kerja Nyata (KKN) Belajar Bersama Komunitas 8 Universitas Airlangga.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/dashboard"
              className="bg-unair-gold hover:bg-amber-500 text-slate-900 px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              Akses Dashboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      {/* Feature Section */}
      <section id="tentang" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Transparansi & Efisiensi</h2>
            <p className="text-slate-600 text-lg">Platform ini dibangun untuk memudahkan pendataan, pelaporan, dan publikasi kegiatan kepada masyarakat luas.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-unair-blue rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kolaborasi Tim</h3>
              <p className="text-slate-600 leading-relaxed">
                Manajemen anggota yang terstruktur, memudahkan pembagian tugas dan monitoring partisipasi setiap mahasiswa.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 text-unair-gold rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Jurnal Kegiatan</h3>
              <p className="text-slate-600 leading-relaxed">
                Pencatatan *logbook* digital secara real-time yang mempermudah evaluasi harian dan penyusunan laporan akhir.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Agenda Terjadwal</h3>
              <p className="text-slate-600 leading-relaxed">
                Kalender terintegrasi yang memastikan seluruh program kerja dieksekusi tepat waktu sesuai perencanaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="tim" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengenal Lebih Dekat</h2>
            <p className="text-slate-600 text-lg">Inilah tim hebat di balik pengabdian masyarakat BBK 8 Universitas Airlangga Gundih 1.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {(!members || members.length === 0) ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                <p>Belum ada data anggota yang ditambahkan melalui Dashboard.</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="group text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-slate-100 mb-4 overflow-hidden shadow-lg group-hover:shadow-unair-blue/20 transition-all group-hover:-translate-y-2 flex items-center justify-center">
                    {member.foto ? (
                      <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{member.nama}</h3>
                  <p className="text-unair-blue font-medium text-sm mb-1">{member.jabatan || 'Anggota'}</p>
                  <p className="text-slate-500 text-xs">{member.fakultas || '-'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-unair-blue rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-unair-gold" />
             </div>
             <span className="font-bold text-slate-900">BBK 8 Universitas Airlangga</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; 2024 Kelompok KKN BBK 8 Gundih 1. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  )
}
