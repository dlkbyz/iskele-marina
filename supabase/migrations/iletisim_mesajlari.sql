-- İletişim mesajları tablosu
create table if not exists iletisim_mesajlari (
  id uuid primary key default gen_random_uuid(),
  ad_soyad text not null,
  email text not null,
  telefon text,
  konu text,
  mesaj text not null,
  okundu boolean default false,
  created_at timestamptz default now()
);

-- RLS: sadece service role yazabilir, anonim kullanamaz
alter table iletisim_mesajlari enable row level security;

-- Admin okuma politikası (authenticated users)
create policy "Admin okuyabilir" on iletisim_mesajlari
  for select using (auth.role() = 'authenticated');

-- Service role her şeyi yapabilir (bypass RLS)
-- API route'da service role key kullanıldığı için insert çalışır
