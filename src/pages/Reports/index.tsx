import { useState } from 'react'
import { useReports, useCreateReport, useUpdateReport, useDeleteReport } from '../../services/api'
import { Plus, Loader2, FileText, Download, CheckCircle2, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Database } from '../../types/supabase'

type ReportRow = Database['public']['Tables']['reports']['Row']

const reportSchema = z.object({
  nama_file: z.string().min(3, "Nama dokumen minimal 3 karakter"),
  file_url: z.string().url("Harus berupa URL yang valid (http/https)"),
  status: z.enum(['pending', 'disetujui', 'revisi']),
})
type ReportForm = z.infer<typeof reportSchema>

export default function Reports() {
  const { data: reports, isLoading, error } = useReports()
  const createMutation = useCreateReport()
  const updateMutation = useUpdateReport()
  const deleteMutation = useDeleteReport()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      status: 'pending'
    }
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ nama_file: '', file_url: '', status: 'pending' })
    setIsModalOpen(true)
  }

  const handleEdit = (report: ReportRow) => {
    setEditingId(report.id)
    setValue('nama_file', report.nama_file)
    setValue('file_url', report.file_url)
    setValue('status', report.status as any)
    setIsModalOpen(true)
  }

  const onSubmit = (data: ReportForm) => {
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
    if (window.confirm('Yakin ingin menghapus dokumen ini?')) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'revisi':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-unair-gold" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'revisi':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-unair-gold/10 text-unair-gold border-unair-gold/20'
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
        Gagal memuat data laporan.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Akhir</h1>
          <p className="text-slate-500">Kelola dokumen proposal, logbook, dan laporan akhir KKN.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambahkan Dokumen (URL)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Nama Dokumen</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Tanggal Unggah</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    Belum ada dokumen laporan yang diunggah.
                  </td>
                </tr>
              ) : (
                reports?.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-unair-blue rounded-lg shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-900">{report.nama_file}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">
                      {format(parseISO(report.created_at), 'd MMM yyyy, HH:mm', { locale: localeId })} WIB
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(report)} className="text-slate-400 hover:text-unair-blue transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(report.id)} className="text-slate-400 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a 
                          href={report.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-unair-blue hover:text-blue-900 font-medium bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Buka</span>
                        </a>
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
        title={editingId ? "Edit Laporan" : "Tambahkan Dokumen Laporan (URL)"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Dokumen *</label>
            <input 
              {...register('nama_file')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Proposal KKN BBK 8.pdf"
            />
            {errors.nama_file && <p className="text-red-500 text-xs mt-1">{errors.nama_file.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link URL Dokumen *</label>
            <input 
              {...register('file_url')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none text-sm" 
              placeholder="https://docs.google.com/... (Link GDrive)"
            />
            {errors.file_url && <p className="text-red-500 text-xs mt-1">{errors.file_url.message}</p>}
            <p className="text-xs text-slate-500 mt-1">Gunakan link Google Drive atau layanan cloud lainnya dan pastikan akses link bersifat publik (Anyone with the link can view).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status Laporan</label>
            <select 
              {...register('status')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none"
            >
              <option value="pending">Menunggu Validasi (Pending)</option>
              <option value="disetujui">Disetujui (Approved)</option>
              <option value="revisi">Perlu Revisi (Revision)</option>
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
              {editingId ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
