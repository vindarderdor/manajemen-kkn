import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { LogIn, Loader2, UserPlus } from 'lucide-react'

// Schema validation
const authSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  nama: z.string().optional(),
})

type AuthFormValues = z.infer<typeof authSchema>

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setSession = useAuthStore(state => state.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthFormValues) => {
    try {
      setIsLoading(true)
      setErrorMsg('')
      setSuccessMsg('')
      
      if (isLogin) {
        // Proses Login
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
        setSession(authData.session)
      } else {
        // Proses Registrasi
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              nama: data.nama || data.email.split('@')[0],
              role: 'anggota' // default role
            }
          }
        })
        if (error) throw error
        
        // Auto create profile in public.profiles since there's no DB trigger
        if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            nama: data.nama || data.email.split('@')[0],
            email: data.email,
            role: 'anggota'
          })
          
          if (profileError) {
            console.error("Error creating profile:", profileError)
            // We don't throw here to avoid failing the auth flow entirely if profile fails, 
            // but in a production app you'd want to handle this robustly.
          }
        }

        if (authData.session) {
           setSession(authData.session)
        } else {
           setSuccessMsg('Registrasi berhasil! Silakan periksa email Anda untuk verifikasi (jika diaktifkan di Supabase). Atau Anda bisa langsung login sekarang.')
           setIsLogin(true)
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isLogin ? 'Selamat Datang 👋' : 'Buat Akun Baru 🚀'}
        </h2>
        <p className="text-slate-500">
          {isLogin ? 'Silakan masuk menggunakan akun KKN Anda.' : 'Daftarkan email dan password untuk mulai menggunakan aplikasi.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              {...register('nama')}
              type="text"
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue transition-colors outline-none"
              disabled={isLoading}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="nama@mhs.unair.ac.id"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue transition-colors outline-none"
            disabled={isLoading}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-unair-blue/20 focus:border-unair-blue transition-colors outline-none"
            disabled={isLoading}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-unair-blue hover:bg-blue-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isLogin ? (
            <>
              <LogIn className="w-5 h-5" />
              Masuk ke Dashboard
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Daftar Akun
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <button 
          onClick={() => {
            setIsLogin(!isLogin)
            setErrorMsg('')
            setSuccessMsg('')
          }}
          className="text-unair-gold hover:text-amber-600 font-bold transition-colors"
        >
          {isLogin ? "Daftar di sini" : "Masuk di sini"}
        </button>
      </div>
    </div>
  )
}
