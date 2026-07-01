import { useState } from 'react'
import { useJournals, useCreateJournal, useUpdateJournal, useDeleteJournal } from '../../services/api'
import { Plus, Loader2, User as UserIcon, Calendar, Clock, MapPin, Search, Edit2, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuthStore } from '../../store/authStore'
import type { Database } from '../../types/supabase'

type JournalRow = Database['public']['Tables']['journals']['Row']

const journalSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  aktivitas: z.string().min(10, "Ceritakan aktivitas minimal 1 baris"),
  kendala: z.string().optional(),
  solusi: z.string().optional(),
  dokumentasi: z.string().optional(),
})
type JournalForm = z.infer<typeof journalSchema>

export default function Journals() {
  const { session } = useAuthStore()
  const { data: journals, isLoading, error } = useJournals()
  const createMutation = useCreateJournal()
  const updateMutation = useUpdateJournal()
  const deleteMutation = useDeleteJournal()

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<JournalForm>({
    resolver: zodResolver(journalSchema)
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ judul: '', aktivitas: '', kendala: '', solusi: '', dokumentasi: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (journal: JournalRow) => {
    setEditingId(journal.id)
    setValue('judul', journal.judul)
    setValue('aktivitas', journal.aktivitas || '')
    setValue('kendala', journal.kendala || '')
    setValue('solusi', journal.solusi || '')
    setValue('dokumentasi', journal.dokumentasi || '')
    setIsModalOpen(true)
  }

  const onSubmit = (data: JournalForm) => {
    if (!session?.user?.id) {
      alert("Anda harus login untuk mengisi jurnal.")
      return
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data }, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
          setEditingId(null)
        }
      })
    } else {
      createMutation.mutate({ ...data, user_id: session.user.id }, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus jurnal ini?')) {
      deleteMutation.mutate(id)
    }
  }

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
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
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
            <div key={journal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
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
                      {format(parseISO(journal.created_at), 'EEEE, d MMMM yyyy', { locale: localeId })}
                    </p>
                  </div>
                </div>

                {/* Show edit/delete only if current user owns this journal, or if admin */}
                {session?.user?.id === journal.user_id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(journal)} className="text-slate-400 hover:text-unair-blue">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(journal.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                {journal.judul}
              </h3>

              <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                {journal.aktivitas || 'Belum ada detail aktivitas.'}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                {journal.dokumentasi ? (
                  <a href={journal.dokumentasi} target="_blank" rel="noopener noreferrer" className="text-xs font-medium bg-blue-50 text-unair-blue hover:bg-blue-100 transition-colors px-2 py-1 rounded-md">
                    Lihat Lampiran
                  </a>
                ) : (
                   <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                    Tidak ada lampiran
                  </span>
                )}
                
                {/* Mobile view buttons */}
                {session?.user?.id === journal.user_id && (
                  <div className="flex sm:hidden gap-3">
                    <button onClick={() => handleEdit(journal)} className="text-unair-blue"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(journal.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Jurnal Harian" : "Isi Jurnal Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Jurnal *</label>
            <input 
              {...register('judul')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Mengajar SD Negeri 1 Gundih"
            />
            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Aktivitas yang Dilakukan *</label>
            <textarea 
              {...register('aktivitas')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              rows={4}
              placeholder="Ceritakan detail aktivitas harianmu..."
            />
            {errors.aktivitas && <p className="text-red-500 text-xs mt-1">{errors.aktivitas.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kendala (Opsional)</label>
            <textarea 
              {...register('kendala')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              rows={2}
              placeholder="Apakah ada kendala yang dihadapi?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Solusi (Opsional)</label>
            <textarea 
              {...register('solusi')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              rows={2}
              placeholder="Bagaimana kamu mengatasi kendala tersebut?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link Dokumentasi / Foto (Opsional)</label>
            <input 
              {...register('dokumentasi')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none text-sm" 
              placeholder="Masukkan link Google Drive atau link gambar"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-unair-blue hover:bg-blue-900 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Simpan Perubahan" : "Simpan Jurnal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
