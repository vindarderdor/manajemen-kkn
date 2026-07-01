import { useState } from 'react'
import { useGalleries, useCreateGallery, useUpdateGallery, useDeleteGallery } from '../../services/api'
import { Plus, Loader2, Image as ImageIcon, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Database } from '../../types/supabase'

type GalleryRow = Database['public']['Tables']['galleries']['Row']

const gallerySchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  image_url: z.string().url("Harus berupa URL yang valid (http/https)"),
})
type GalleryForm = z.infer<typeof gallerySchema>

export default function Gallery() {
  const { data: galleries, isLoading, error } = useGalleries()
  const createMutation = useCreateGallery()
  const updateMutation = useUpdateGallery()
  const deleteMutation = useDeleteGallery()

  const [filter, setFilter] = useState('Semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GalleryForm>({
    resolver: zodResolver(gallerySchema)
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ judul: '', image_url: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (gallery: GalleryRow) => {
    setEditingId(gallery.id)
    setValue('judul', gallery.judul)
    setValue('image_url', gallery.image_url)
    setIsModalOpen(true)
  }

  const onSubmit = (data: GalleryForm) => {
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Yakin ingin menghapus foto ini dari galeri?')) {
      deleteMutation.mutate(id)
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
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto (URL)
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
            <div key={item.id} onClick={() => handleEdit(item)} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer aspect-square">
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
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                  onClick={(e) => handleDelete(item.id, e)} 
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-medium line-clamp-2 mb-1">{item.judul}</h3>
                <p className="text-slate-300 text-xs">
                  {format(parseISO(item.created_at), 'd MMM yyyy', { locale: localeId })}
                </p>
                <div className="absolute top-4 left-4 bg-white/20 p-2 rounded-full backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Dokumentasi" : "Tambah Dokumentasi (URL)"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul / Keterangan *</label>
            <input 
              {...register('judul')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Kegiatan Posyandu Mawar"
            />
            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link URL Gambar (Public) *</label>
            <input 
              {...register('image_url')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none text-sm" 
              placeholder="https://contoh.com/gambar123.jpg"
            />
            {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
            <p className="text-xs text-slate-500 mt-1">Masukkan direct link gambar (.jpg, .png, .webp) atau link Imgur/Google Drive yang terbuka untuk publik.</p>
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
              {editingId ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
