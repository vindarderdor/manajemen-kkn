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

type PublicMember = Database['public']['Tables']['public_members']['Row']

// --- Members API (Public Members) ---
export const useMembers = () => {
  return useQuery({
    queryKey: ['public_members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('public_members').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return data as PublicMember[]
    }
  })
}

export const useCreateMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newMember: Database['public']['Tables']['public_members']['Insert']) => {
      const { data, error } = await supabase.from('public_members').insert(newMember).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['public_members'] })
  })
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['public_members']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('public_members').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['public_members'] })
  })
}

export const useDeleteMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('public_members').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['public_members'] })
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

export const useUpdateWorkProgram = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['work_programs']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('work_programs').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work_programs'] })
  })
}

export const useDeleteWorkProgram = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('work_programs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work_programs'] })
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

export const useCreateSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newItem: Database['public']['Tables']['schedules']['Insert']) => {
      const { data, error } = await supabase.from('schedules').insert(newItem).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] })
  })
}

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['schedules']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('schedules').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] })
  })
}

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedules').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] })
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

export const useCreateJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newItem: Database['public']['Tables']['journals']['Insert']) => {
      const { data, error } = await supabase.from('journals').insert(newItem).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journals'] })
  })
}

export const useUpdateJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['journals']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('journals').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journals'] })
  })
}

export const useDeleteJournal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('journals').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journals'] })
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

export const useCreateGallery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newItem: Database['public']['Tables']['galleries']['Insert']) => {
      const { data, error } = await supabase.from('galleries').insert(newItem).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] })
  })
}

export const useUpdateGallery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['galleries']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('galleries').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] })
  })
}

export const useDeleteGallery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('galleries').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['galleries'] })
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

export const useCreateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newItem: Database['public']['Tables']['reports']['Insert']) => {
      const { data, error } = await supabase.from('reports').insert(newItem).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] })
  })
}

export const useUpdateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Database['public']['Tables']['reports']['Update'] & { id: string }) => {
      const { data, error } = await supabase.from('reports').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] })
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reports').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] })
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
