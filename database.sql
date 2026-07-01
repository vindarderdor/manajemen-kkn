-- Supabase Schema for BBK 8 UNAIR GUNDIH 1

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nama TEXT NOT NULL,
  nim TEXT UNIQUE,
  prodi TEXT,
  fakultas TEXT,
  jabatan TEXT,
  email TEXT UNIQUE NOT NULL,
  foto TEXT,
  role TEXT DEFAULT 'anggota' CHECK (role IN ('administrator', 'ketua', 'anggota')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 2. Work Programs (Program Kerja)
CREATE TABLE work_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT,
  deskripsi TEXT,
  target TEXT,
  penanggung_jawab UUID REFERENCES profiles(id),
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Perencanaan' CHECK (status IN ('Perencanaan', 'Berjalan', 'Selesai', 'Ditunda')),
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE work_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Work programs viewable by everyone." ON work_programs FOR SELECT USING (true);
CREATE POLICY "Admin and ketua can insert work programs." ON work_programs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'administrator' OR profiles.role = 'ketua'))
);
CREATE POLICY "Admin and ketua can update work programs." ON work_programs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'administrator' OR profiles.role = 'ketua'))
);


-- 3. Schedules (Jadwal)
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  lokasi TEXT,
  tanggal DATE NOT NULL,
  waktu TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schedules viewable by everyone." ON schedules FOR SELECT USING (true);
CREATE POLICY "Admin and ketua can manage schedules." ON schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'administrator' OR profiles.role = 'ketua'))
);

-- 4. Journals (Jurnal Harian)
CREATE TABLE journals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  judul TEXT NOT NULL,
  aktivitas TEXT,
  kendala TEXT,
  solusi TEXT,
  dokumentasi TEXT, -- Array of URLs or single URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journals viewable by everyone." ON journals FOR SELECT USING (true);
CREATE POLICY "Users can manage their own journals." ON journals FOR ALL USING ( auth.uid() = user_id );

-- 5. Galleries (Dokumentasi)
CREATE TABLE galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Galleries viewable by everyone." ON galleries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert galleries." ON galleries FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- 6. Reports (Laporan)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_file TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports viewable by everyone." ON reports FOR SELECT USING (true);
CREATE POLICY "Admin and ketua can manage reports." ON reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'administrator' OR profiles.role = 'ketua'))
);

-- 7. Announcements (Pengumuman)
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Announcements viewable by everyone." ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin can manage announcements." ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'administrator')
);

-- 8. Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications." ON notifications FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY "Users can update their own notifications." ON notifications FOR UPDATE USING ( auth.uid() = user_id );

