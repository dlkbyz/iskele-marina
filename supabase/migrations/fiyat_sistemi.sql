-- Fiyat Ayarları Tablosu
CREATE TABLE IF NOT EXISTS fiyat_ayarlari (
  id BIGSERIAL PRIMARY KEY,
  tip VARCHAR(50) NOT NULL CHECK (tip IN ('varsayilan', 'hafta_sonu', 'sezon', 'ozel_tarih')),
  fiyat DECIMAL(10, 2) NOT NULL,
  baslangic_tarihi DATE,
  bitis_tarihi DATE,
  aciklama TEXT,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan fiyat ayarları
INSERT INTO fiyat_ayarlari (tip, fiyat, aciklama) VALUES 
('varsayilan', 150.00, 'Standart günlük fiyat');

-- İndeks oluştur
CREATE INDEX idx_fiyat_tarih ON fiyat_ayarlari(baslangic_tarihi, bitis_tarihi);
CREATE INDEX idx_fiyat_tip ON fiyat_ayarlari(tip);

-- Güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_fiyat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fiyat_updated_at_trigger
BEFORE UPDATE ON fiyat_ayarlari
FOR EACH ROW
EXECUTE FUNCTION update_fiyat_updated_at();

COMMENT ON TABLE fiyat_ayarlari IS 'Dinamik fiyatlandırma sistemi - günlük, hafta sonu, sezonluk ve özel tarih fiyatları';
