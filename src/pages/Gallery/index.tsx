import { useState } from 'react'
import { useGalleries } from '../../services/api'
import { Plus, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Gallery() {
  const { data: galleries, isLoading, error } = useGalleries()
  const [filter, setFilter] = useState('Semua')

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
        Gagal memuat data galeri.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Galeri & Dokumentasi</h1>
          <p className="text-slate-500">Kumpulan foto dan dokumentasi kegiatan KKN.</p>
        </div>
        <button className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Unggah Foto
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Semua', 'Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Lainnya'].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${filter === tag 
                ? 'bg-unair-blue text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {galleries?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Belum ada dokumentasi yang diunggah.</p>
          </div>
        ) : (
          galleries?.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer aspect-square">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-medium line-clamp-2 mb-1">{item.judul}</h3>
                <p className="text-slate-300 text-xs">
                  {format(parseISO(item.created_at), 'd MMM yyyy', { locale: id })}
                </p>
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
