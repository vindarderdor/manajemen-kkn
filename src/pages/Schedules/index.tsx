import { useState } from 'react'
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../../services/api'
import { Loader2, Plus, Calendar as CalendarIcon, MapPin, Clock, Edit2, Trash2 } from 'lucide-react'
import { format, isSameDay, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Database } from '../../types/supabase'

type ScheduleRow = Database['public']['Tables']['schedules']['Row']

const scheduleSchema = z.object({
  judul: z.string().min(3, "Judul kegiatan minimal 3 karakter"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  waktu: z.string().optional(),
  lokasi: z.string().optional(),
})
type ScheduleForm = z.infer<typeof scheduleSchema>

export default function Schedules() {
  const { data: schedules, isLoading, error } = useSchedules()
  const createMutation = useCreateSchedule()
  const updateMutation = useUpdateSchedule()
  const deleteMutation = useDeleteSchedule()
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      tanggal: format(new Date(), 'yyyy-MM-dd')
    }
  })

  const openCreateModal = () => {
    setEditingId(null)
    reset({ 
      judul: '', 
      tanggal: format(selectedDate, 'yyyy-MM-dd'), 
      waktu: '', 
      lokasi: '' 
    })
    setIsModalOpen(true)
  }

  const handleEdit = (schedule: ScheduleRow) => {
    setEditingId(schedule.id)
    setValue('judul', schedule.judul)
    setValue('tanggal', schedule.tanggal)
    setValue('waktu', schedule.waktu?.substring(0,5) || '')
    setValue('lokasi', schedule.lokasi || '')
    setIsModalOpen(true)
  }

  const onSubmit = (data: ScheduleForm) => {
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
    if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
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
        Gagal memuat data jadwal kegiatan.
      </div>
    )
  }

  const selectedSchedules = schedules?.filter(schedule => 
    isSameDay(parseISO(schedule.tanggal), selectedDate)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jadwal Kegiatan</h1>
          <p className="text-slate-500">Agenda lengkap kegiatan BBK 8 Gundih 1.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Calendar Sidebar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-unair-blue" />
            Pilih Tanggal
          </h2>
          <div className="mb-4">
            <input 
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-unair-blue/20 outline-none text-slate-700"
            />
          </div>
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
            <p className="text-sm text-slate-500 mb-1">Menampilkan Agenda</p>
            <p className="font-bold text-unair-blue text-lg">
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeId })}
            </p>
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex justify-between items-center">
              <span>Agenda ({selectedSchedules?.length || 0})</span>
            </h2>

            <div className="space-y-4">
              {selectedSchedules?.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>Tidak ada kegiatan pada tanggal ini.</p>
                </div>
              ) : (
                selectedSchedules?.map((schedule) => (
                  <div key={schedule.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 hover:border-unair-blue/30 hover:bg-blue-50/50 transition-colors group">
                    <div className="flex flex-row sm:flex-col items-center justify-center sm:min-w-[80px] sm:border-r border-slate-200 sm:pr-4 gap-2 sm:gap-0 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
                      <span className="text-xl sm:text-2xl font-bold text-unair-blue">
                        {schedule.waktu ? schedule.waktu.substring(0,5) : '-'}
                      </span>
                      {schedule.waktu && <span className="text-xs font-medium text-slate-500 uppercase">WIB</span>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{schedule.judul}</h3>
                        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(schedule)} className="text-slate-400 hover:text-unair-blue">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(schedule.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                        {schedule.lokasi && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            {schedule.lokasi}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          Waktu Setempat
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan *</label>
            <input 
              {...register('judul')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Rapat Evaluasi Mingguan"
            />
            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal *</label>
              <input 
                type="date"
                {...register('tanggal')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none"
              />
              {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
              <input 
                type="time"
                {...register('waktu')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
            <input 
              {...register('lokasi')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue outline-none" 
              placeholder="Contoh: Balai Desa Gundih"
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
              {editingId ? "Simpan Perubahan" : "Simpan Jadwal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
