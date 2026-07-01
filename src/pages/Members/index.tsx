import { useState } from 'react'
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from '../../services/api'
import { Search, Plus, User as UserIcon, Loader2, Edit2, Trash2 } from 'lucide-react'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Database } from '../../types/supabase'

type PublicMemberRow = Database['public']['Tables']['public_members']['Row']

const memberSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nim: z.string().optional(),
  prodi: z.string().optional(),
  fakultas: z.string().optional(),
  jabatan: z.string().optional(),
  foto: z.string().url("Harus berupa URL gambar yang valid").optional().or(z.literal('')),
})
type MemberForm = z.infer<typeof memberSchema>

export default function Members() {
  const { data: members, isLoading, error } = useMembers()
  const createMutation = useCreateMember()
  const updateMutation = useUpdateMember()
  const deleteMutation = useDeleteMember()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema)
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ nama: '', nim: '', prodi: '', fakultas: '', jabatan: '', foto: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (member: PublicMemberRow) => {
    setEditingId(member.id)
    setValue('nama', member.nama)
    setValue('nim', member.nim || '')
    setValue('prodi', member.prodi || '')
    setValue('fakultas', member.fakultas || '')
    setValue('jabatan', member.jabatan || '')
    setValue('foto', member.foto || '')
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus anggota ini dari publik?')) {
      deleteMutation.mutate(id)
    }
  }

  const onSubmit = (data: MemberForm) => {
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

  const filteredMembers = members?.filter(member => 
    member.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.nim?.toLowerCase().includes(searchTerm.toLowerCase())
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
        Gagal memuat data anggota.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Anggota Kelompok</h1>
          <p className="text-slate-500">Kelola data anggota BBK 8 Gundih 1 untuk Landing Page</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Nama Anggota</th>
                <th className="px-6 py-4 font-medium">NIM</th>
                <th className="px-6 py-4 font-medium">Fakultas / Prodi</th>
                <th className="px-6 py-4 font-medium">Jabatan</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMembers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada anggota ditemukan. Silakan tambahkan anggota.
                  </td>
                </tr>
              ) : (
                filteredMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-unair-blue/10 flex items-center justify-center text-unair-blue overflow-hidden shrink-0">
                          {member.foto ? (
                            <img src={member.foto} alt={member.nama} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.nama}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{member.nim || '-'}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{member.fakultas || '-'}</p>
                      <p className="text-xs text-slate-500">{member.prodi || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-unair-blue border-blue-200">
                        {member.jabatan || 'Anggota'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(member)} 
                          className="inline-flex items-center gap-1.5 text-unair-blue hover:text-blue-900 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)} 
                          className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Profil Anggota" : "Tambah Anggota Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
            <input 
              {...register('nama')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
            />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIM</label>
              <input 
                {...register('nim')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fakultas</label>
              <input 
                {...register('fakultas')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
              <input 
                {...register('prodi')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan di KKN</label>
              <input 
                {...register('jabatan')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
                placeholder="Contoh: Sekretaris"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foto Anggota (URL Opsional)</label>
            <input 
              {...register('foto')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none text-sm" 
              placeholder="https://contoh.com/foto.jpg"
            />
            {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto.message}</p>}
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
              {editingId ? "Simpan Perubahan" : "Tambah Anggota"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
