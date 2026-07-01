import { useState } from 'react'
import { useJournals } from '../../services/api'
import { Plus, Loader2, User as UserIcon, Calendar, Clock, MapPin, Search } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Journals() {
  const { data: journals, isLoading, error } = useJournals()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJournals = journals?.filter(journal => 
    journal.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (journal as any).user?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-unair-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        Gagal memuat data jurnal harian.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jurnal Harian</h1>
          <p className="text-slate-500">Catatan harian kegiatan individu peserta KKN.</p>
        </div>
        <button className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Isi Jurnal Baru
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari judul atau nama penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJournals?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            Tidak ada jurnal ditemukan.
          </div>
        ) : (
          filteredJournals?.map((journal) => (
            <div key={journal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:border-unair-blue/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {(journal as any).user?.foto ? (
                    <img src={(journal as any).user.foto} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 line-clamp-1">{(journal as any).user?.nama || 'Anonim'}</p>
                  <p className="text-xs text-slate-500">
                    {format(parseISO(journal.created_at), 'EEEE, d MMMM yyyy', { locale: id })}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                {journal.judul}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">Lokasi Kegiatan / Balai Desa</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>08:00 - 15:00 WIB</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                {journal.aktivitas || 'Belum ada detail aktivitas.'}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                {journal.dokumentasi ? (
                  <span className="text-xs font-medium bg-blue-50 text-unair-blue px-2 py-1 rounded-md">
                    Ada Lampiran
                  </span>
                ) : (
                   <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                    Tidak ada lampiran
                  </span>
                )}
                
                <button className="text-sm font-medium text-unair-blue hover:text-blue-900">
                  Baca Selengkapnya
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
