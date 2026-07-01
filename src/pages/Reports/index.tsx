import { useState } from 'react'
import { useReports } from '../../services/api'
import { Plus, Loader2, FileText, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Reports() {
  const { data: reports, isLoading, error } = useReports()

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
        <button className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Unggah Dokumen
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Nama Dokumen</th>
                <th className="px-6 py-4 font-medium">Tanggal Unggah</th>
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
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-unair-blue rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-900">{report.nama_file}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(parseISO(report.created_at), 'd MMM yyyy, HH:mm', { locale: id })} WIB
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
                      <a 
                        href={report.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-unair-blue hover:text-blue-900 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Unduh
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
