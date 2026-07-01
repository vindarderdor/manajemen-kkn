import { useState } from 'react'
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '../../services/api'
import { Plus, Loader2, Bell, Megaphone, Trash2, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Announcements() {
  const { data: announcements, isLoading, error } = useAnnouncements()
  const createMutation = useCreateAnnouncement()
  const deleteMutation = useDeleteAnnouncement()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [judul, setJudul] = useState('')
  const [isi, setIsi] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judul || !isi) return

    try {
      await createMutation.mutateAsync({ judul, isi })
      setIsModalOpen(false)
      setJudul('')
      setIsi('')
    } catch (err) {
      alert("Gagal membuat pengumuman.")
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (err) {
        alert("Gagal menghapus pengumuman.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-unair-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
        <h3 className="font-bold text-lg mb-2">Tabel Database Belum Ditemukan</h3>
        <p>Sistem masih mendeteksi error dari database. Pastikan Anda sudah menjalankan kode <code>database.sql</code> di Supabase SQL Editor Anda agar tabel <b>announcements</b> terbentuk.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengumuman</h1>
          <p className="text-slate-500">Informasi dan pemberitahuan penting untuk seluruh anggota.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {announcements?.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Belum ada pengumuman terbaru.</p>
          </div>
        ) : (
          announcements?.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 group">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-blue-50 items-center justify-center text-unair-blue shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <h3 className="text-lg font-bold text-slate-900">{item.judul}</h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md self-start sm:self-auto">
                      {format(parseISO(item.created_at), 'd MMMM yyyy, HH:mm', { locale: id })}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                  {item.isi}
                </div>
                
                {/* Delete button mobile */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="mt-4 text-sm text-red-500 font-medium sm:hidden flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Buat Pengumuman */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Buat Pengumuman Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Judul Pengumuman</label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none transition-colors"
                    placeholder="Contoh: Rapat Koordinasi Sore Ini"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Isi Pengumuman</label>
                  <textarea
                    required
                    rows={5}
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none transition-colors resize-none"
                    placeholder="Tuliskan detail pengumuman di sini..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-unair-blue hover:bg-blue-900 text-white font-medium transition-colors disabled:opacity-70"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sebarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
