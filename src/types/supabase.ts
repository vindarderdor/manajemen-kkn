export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nama: string
          nim: string | null
          prodi: string | null
          fakultas: string | null
          jabatan: string | null
          email: string
          foto: string | null
          role: 'administrator' | 'ketua' | 'anggota'
          created_at: string
        }
        Insert: {
          id: string
          nama: string
          nim?: string | null
          prodi?: string | null
          fakultas?: string | null
          jabatan?: string | null
          email: string
          foto?: string | null
          role?: 'administrator' | 'ketua' | 'anggota'
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          nim?: string | null
          prodi?: string | null
          fakultas?: string | null
          jabatan?: string | null
          email?: string
          foto?: string | null
          role?: 'administrator' | 'ketua' | 'anggota'
          created_at?: string
        }
      }
      work_programs: {
        Row: {
          id: string
          nama: string
          kategori: string | null
          deskripsi: string | null
          target: string | null
          penanggung_jawab: string | null
          progress: number
          status: 'Perencanaan' | 'Berjalan' | 'Selesai' | 'Ditunda'
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nama: string
          kategori?: string | null
          deskripsi?: string | null
          target?: string | null
          penanggung_jawab?: string | null
          progress?: number
          status?: 'Perencanaan' | 'Berjalan' | 'Selesai' | 'Ditunda'
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          kategori?: string | null
          deskripsi?: string | null
          target?: string | null
          penanggung_jawab?: string | null
          progress?: number
          status?: 'Perencanaan' | 'Berjalan' | 'Selesai' | 'Ditunda'
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          judul: string
          lokasi: string | null
          tanggal: string
          waktu: string | null
          created_at: string
        }
        Insert: {
          id?: string
          judul: string
          lokasi?: string | null
          tanggal: string
          waktu?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          judul?: string
          lokasi?: string | null
          tanggal?: string
          waktu?: string | null
          created_at?: string
        }
      }
      journals: {
        Row: {
          id: string
          user_id: string
          judul: string
          aktivitas: string | null
          kendala: string | null
          solusi: string | null
          dokumentasi: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          judul: string
          aktivitas?: string | null
          kendala?: string | null
          solusi?: string | null
          dokumentasi?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          judul?: string
          aktivitas?: string | null
          kendala?: string | null
          solusi?: string | null
          dokumentasi?: string | null
          created_at?: string
        }
      }
      galleries: {
        Row: {
          id: string
          judul: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          judul: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          judul?: string
          image_url?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          nama_file: string
          file_url: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          nama_file: string
          file_url: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          nama_file?: string
          file_url?: string
          status?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          judul: string
          isi: string
          created_at: string
        }
        Insert: {
          id?: string
          judul: string
          isi: string
          created_at?: string
        }
        Update: {
          id?: string
          judul?: string
          isi?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
