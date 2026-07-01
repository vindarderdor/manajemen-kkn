import { useState } from 'react'
import { useMembers } from '../../services/api'
import { Search, Plus, User as UserIcon, Loader2 } from 'lucide-react'

export default function Members() {
  const { data: members, isLoading, error } = useMembers()
  const [searchTerm, setSearchTerm] = useState('')

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
          <p className="text-slate-500">Kelola data anggota BBK 8 Gundih 1</p>
        </div>
        <button className="flex items-center gap-2 bg-unair-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
          <table className="w-full text-left border-collapse">
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
                    Tidak ada anggota ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
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
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{member.nim || '-'}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{member.fakultas || '-'}</p>
                      <p className="text-xs text-slate-500">{member.prodi || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${member.role === 'administrator' ? 'bg-red-50 text-red-700 border-red-200' : 
                          member.role === 'ketua' ? 'bg-unair-gold/10 text-unair-gold border-unair-gold/20' : 
                          'bg-blue-50 text-unair-blue border-blue-200'}
                      `}>
                        {member.jabatan || member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-unair-blue hover:text-blue-900 font-medium">Detail</button>
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
