import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type WorkProgram = Database['public']['Tables']['work_programs']['Row']
type Schedule = Database['public']['Tables']['schedules']['Row']
type Journal = Database['public']['Tables']['journals']['Row']
type Gallery = Database['public']['Tables']['galleries']['Row']
type Report = Database['public']['Tables']['reports']['Row']
type Announcement = Database['public']['Tables']['announcements']['Row']

// --- Members API ---
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('nama')
      if (error) throw error
      return data as Profile[]
    }
  })
}

// --- Work Programs API ---
export const useWorkPrograms = () => {
  return useQuery({
    queryKey: ['work_programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_programs')
        .select(`
          *,
          penanggung_jawab:profiles(nama)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

export const useCreateWorkProgram = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newProgram: Database['public']['Tables']['work_programs']['Insert']) => {
      const { data, error } = await supabase
        .from('work_programs')
        .insert(newProgram)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_programs'] })
    }
  })
}

// --- Schedules API ---
export const useSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schedules').select('*').order('tanggal', { ascending: true })
      if (error) throw error
      return data as Schedule[]
    }
  })
}

// --- Journals API ---
export const useJournals = () => {
  return useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journals')
        .select(`
          *,
          user:profiles(nama, foto)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

// --- Galleries API ---
export const useGalleries = () => {
  return useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as Gallery[]
    }
  })
}

// --- Reports API ---
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as Report[]
    }
  })
}

// --- Announcements API ---
export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as Announcement[]
    }
  })
}

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newAnnouncement: Database['public']['Tables']['announcements']['Insert']) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert(newAnnouncement)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    }
  })
}

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    }
  })
}
