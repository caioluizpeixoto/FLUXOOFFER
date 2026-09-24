-- ========================================================
-- FLUXOOFFER - SCHEMA DE PERSISTÊNCIA SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase
-- ========================================================

-- 1. TABELA DE OFERTAS / ANÚNCIOS SALVOS (COFRE)
CREATE TABLE IF NOT EXISTS public.offers (
  id TEXT PRIMARY KEY,
  meta_ad_id TEXT,
  advertiser_name TEXT NOT NULL DEFAULT 'Anunciante não identificado',
  advertiser_id TEXT,
  advertiser_url TEXT,
  advertiser_library_url TEXT,
  copy TEXT DEFAULT '',
  cta TEXT DEFAULT '',
  creative_type TEXT DEFAULT 'desconhecido',
  creative_url TEXT,
  thumbnail_url TEXT,
  landing_page_url TEXT,
  meta_library_url TEXT,
  start_date TEXT,
  ad_count_current INTEGER DEFAULT 1,
  days_running_current INTEGER DEFAULT 0,
  ad_count_when_saved INTEGER DEFAULT 1,
  days_running_when_saved INTEGER DEFAULT 0,
  status_when_saved TEXT DEFAULT 'ativo',
  search_term TEXT DEFAULT '',
  niche TEXT DEFAULT 'Geral',
  folder TEXT DEFAULT 'Principal',
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  saved_by TEXT DEFAULT 'Caio (Admin)',
  saved_by_email TEXT DEFAULT '',
  api_key TEXT DEFAULT '',
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para buscas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_offers_meta_ad_id ON public.offers(meta_ad_id);
CREATE INDEX IF NOT EXISTS idx_offers_saved_at ON public.offers(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_folder ON public.offers(folder);
CREATE INDEX IF NOT EXISTS idx_offers_niche ON public.offers(niche);
CREATE INDEX IF NOT EXISTS idx_offers_saved_by ON public.offers(saved_by);

-- 2. TABELA DE CHAVES DE API DA EQUIPE
CREATE TABLE IF NOT EXISTS public.api_keys (
  key TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT DEFAULT '',
  role TEXT DEFAULT 'miner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Inserir as chaves master padrão se não existirem
INSERT INTO public.api_keys (key, user_name, user_email, role, created_at)
VALUES 
  ('fo_live_caio_master', 'Caio (Admin)', 'caio@fluxooffer.com', 'admin', NOW()),
  ('fo_live_admin_master88', 'Caio (Admin Master)', 'caio@fluxooffer.com', 'admin', NOW())
ON CONFLICT (key) DO NOTHING;

-- 3. HABILITAR ACESSO PÚBLICO/API (RLS)
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso livre para leitura e escrita autenticada via chave anon/service
DROP POLICY IF EXISTS "Acesso total offers" ON public.offers;
CREATE POLICY "Acesso total offers" ON public.offers
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total api_keys" ON public.api_keys;
CREATE POLICY "Acesso total api_keys" ON public.api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);
