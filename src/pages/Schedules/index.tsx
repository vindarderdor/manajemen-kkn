import { useState } from 'react'
import { useSchedules } from '../../services/api'
import { Loader2, Plus, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { format, isSameDay, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Schedules() {
  const { data: schedules, isLoading, error } = useSchedules()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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
        <button className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Calendar Sidebar (Placeholder for full calendar) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-unair-blue" />
            Pilih Tanggal
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-center">
            <p className="text-sm text-slate-500 mb-1">Tanggal Terpilih</p>
            <p className="font-bold text-unair-blue text-lg">
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center">
            (Pilih tanggal di sini - Integrasi kalender lengkap bisa menggunakan react-day-picker)
          </p>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Agenda ({selectedSchedules?.length || 0})
            </h2>

            <div className="space-y-4">
              {selectedSchedules?.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>Tidak ada kegiatan pada tanggal ini.</p>
                </div>
              ) : (
                selectedSchedules?.map((schedule) => (
                  <div key={schedule.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-unair-blue/30 hover:bg-blue-50/50 transition-colors">
                    <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-slate-200 pr-4">
                      <span className="text-2xl font-bold text-unair-blue">
                        {schedule.waktu ? schedule.waktu.substring(0,5) : '-'}
                      </span>
                      <span className="text-xs font-medium text-slate-500 uppercase">WIB</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{schedule.judul}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                        {schedule.lokasi && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {schedule.lokasi}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          Durasi fleksibel
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
    </div>
  )
}
