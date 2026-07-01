import { useState, useEffect } from 'react'
import { useWorkPrograms, useCreateWorkProgram, useUpdateWorkProgram, useDeleteWorkProgram } from '../../services/api'
import { Search, Plus, Loader2, Calendar, Target, Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Database } from '../../types/supabase'

type WorkProgramRow = Database['public']['Tables']['work_programs']['Row']

const prokerSchema = z.object({
  nama: z.string().min(3, "Nama program minimal 3 karakter"),
  kategori: z.string().optional(),
  deskripsi: z.string().optional(),
  target: z.string().optional(),
  status: z.enum(['Perencanaan', 'Berjalan', 'Selesai', 'Ditunda']),
  progress: z.number().min(0).max(100),
})
type ProkerForm = z.infer<typeof prokerSchema>

export default function WorkPrograms() {
  const { data: programs, isLoading, error } = useWorkPrograms()
  const createMutation = useCreateWorkProgram()
  const updateMutation = useUpdateWorkProgram()
  const deleteMutation = useDeleteWorkProgram()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKategori, setFilterKategori] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProkerForm>({
    resolver: zodResolver(prokerSchema),
    defaultValues: {
      status: 'Perencanaan',
      progress: 0
    }
  })

  // Open modal for edit
  const handleEdit = (prog: WorkProgramRow) => {
    setEditingId(prog.id)
    setValue('nama', prog.nama)
    setValue('kategori', prog.kategori || '')
    setValue('deskripsi', prog.deskripsi || '')
    setValue('target', prog.target || '')
    setValue('status', prog.status as any)
    setValue('progress', prog.progress || 0)
    setIsModalOpen(true)
  }

  // Handle Create or Update
  const onSubmit = (data: ProkerForm) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data }, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
          setEditingId(null)
        }
      })
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus program kerja ini?')) {
      deleteMutation.mutate(id)
    }
  }

  const openCreateModal = () => {
    setEditingId(null)
    reset({ status: 'Perencanaan', progress: 0, nama: '', kategori: '', deskripsi: '', target: '' })
    setIsModalOpen(true)
  }

  const filteredPrograms = programs?.filter(prog => {
    const matchesSearch = prog.nama.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesKategori = filterKategori ? prog.kategori === filterKategori : true
    return matchesSearch && matchesKategori
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Berjalan': return 'bg-unair-gold/10 text-unair-gold border-unair-gold/20'
      case 'Ditunda': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
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
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        Gagal memuat data program kerja.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Kerja</h1>
          <p className="text-slate-500">Kelola proker dan pantau progres pelaksanaannya.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Proker
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari program kerja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none transition-colors"
          />
        </div>
        
        <select 
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue"
        >
          <option value="">Semua Kategori</option>
          <option value="Kesehatan">Kesehatan</option>
          <option value="Pendidikan">Pendidikan</option>
          <option value="Ekonomi">Ekonomi</option>
          <option value="Lingkungan">Lingkungan</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            Tidak ada program kerja ditemukan.
          </div>
        ) : (
          filteredPrograms?.map((prog) => (
            <div key={prog.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(prog.status)}`}>
                  {prog.status}
                </span>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(prog)} className="text-slate-400 hover:text-unair-blue" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(prog.id)} className="text-slate-400 hover:text-red-500" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2" title={prog.nama}>
                {prog.nama}
              </h3>
              
              <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">
                {prog.deskripsi || 'Belum ada deskripsi.'}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    {prog.tanggal_mulai ? format(new Date(prog.tanggal_mulai), 'd MMM yyyy', { locale: localeId }) : '-'} 
                    {' '}s/d{' '} 
                    {prog.tanggal_selesai ? format(new Date(prog.tanggal_selesai), 'd MMM yyyy', { locale: localeId }) : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span className="truncate" title={prog.target || ''}>Target: {prog.target || '-'}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-500">Progress</span>
                  <span className="text-xs font-bold text-unair-blue">{prog.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-unair-blue h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${prog.progress}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    Kategori: <span className="font-medium text-slate-700">{prog.kategori || 'Umum'}</span>
                  </span>
                </div>
                {/* Mobile action buttons */}
                <div className="mt-4 flex justify-end gap-3 sm:hidden border-t border-slate-100 pt-3">
                  <button onClick={() => handleEdit(prog)} className="text-sm font-medium text-unair-blue flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(prog.id)} className="text-sm font-medium text-red-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Program Kerja" : "Tambah Program Kerja"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program Kerja *</label>
            <input 
              {...register('nama')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Penyuluhan Kesehatan"
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
            <select 
              {...register('kategori')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none"
            >
              <option value="">Pilih Kategori</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Lingkungan">Lingkungan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Sasaran</label>
            <input 
              {...register('target')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Ibu Hamil dan Balita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
            <textarea 
              {...register('deskripsi')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              rows={3}
              placeholder="Jelaskan tujuan dan gambaran kegiatan..."
            />
          </div>
          
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Progres (%)</label>
              <input 
                type="number"
                {...register('progress', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
                min="0" max="100"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              {...register('status')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none"
            >
              <option value="Perencanaan">Perencanaan</option>
              <option value="Berjalan">Berjalan</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditunda">Ditunda</option>
            </select>
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
              {editingId ? "Simpan Perubahan" : "Simpan Proker"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
