import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface SavedAd {
  id: string;
  metaAdId: string | null;
  advertiserName: string;
  advertiserId: string | null;
  advertiserUrl: string | null;
  advertiserLibraryUrl: string | null;
  copy: string;
  cta: string;
  creativeType: string;
  creativeUrl: string | null;
  thumbnailUrl: string | null;
  landingPageUrl: string | null;
  metaLibraryUrl: string | null;
  startDate: string | null;
  adCountCurrent: number;
  daysRunningCurrent: number;
  adCountWhenSaved: number;
  daysRunningWhenSaved: number;
  statusWhenSaved: string;
  searchTerm?: string;
  niche?: string;
  folder?: string;
  tags?: string[];
  notes?: string;
  savedBy?: string;
  savedByEmail?: string;
  apiKey?: string;
  savedAt: string;
}

// Fallback de arquivos para ambiente sem banco configurado
const isServerless = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "offers.json");
const BUNDLED_FILE = path.join(process.cwd(), "data", "offers.json");

const SEED_OFFERS: SavedAd[] = [];

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      let initialData = SEED_OFFERS;
      try {
        const bundledRaw = await fs.readFile(BUNDLED_FILE, "utf-8");
        const parsed = JSON.parse(bundledRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialData = parsed;
        }
      } catch {
        // Usa SEED_OFFERS
      }
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Erro ao garantir arquivo de dados do cofre:", err);
  }
}

// Conversores entre o formato do banco de dados (snake_case) e o app (camelCase)
function mapDbRowToSavedAd(row: any): SavedAd {
  return {
    id: row.id,
    metaAdId: row.meta_ad_id || null,
    advertiserName: row.advertiser_name || "Anunciante não identificado",
    advertiserId: row.advertiser_id || null,
    advertiserUrl: row.advertiser_url || null,
    advertiserLibraryUrl: row.advertiser_library_url || null,
    copy: row.copy || "",
    cta: row.cta || "",
    creativeType: row.creative_type || "desconhecido",
    creativeUrl: row.creative_url || null,
    thumbnailUrl: row.thumbnail_url || null,
    landingPageUrl: row.landing_page_url || null,
    metaLibraryUrl: row.meta_library_url || null,
    startDate: row.start_date || null,
    adCountCurrent: Number(row.ad_count_current) || 1,
    daysRunningCurrent: Number(row.days_running_current) || 0,
    adCountWhenSaved: Number(row.ad_count_when_saved) || Number(row.ad_count_current) || 1,
    daysRunningWhenSaved: Number(row.days_running_when_saved) || Number(row.days_running_current) || 0,
    statusWhenSaved: row.status_when_saved || "ativo",
    searchTerm: row.search_term || "",
    niche: row.niche || "Geral",
    folder: row.folder || "Principal",
    tags: Array.isArray(row.tags) ? row.tags : [],
    notes: row.notes || "",
    savedBy: row.saved_by || "Caio (Admin)",
    savedByEmail: row.saved_by_email || "",
    apiKey: row.api_key || "",
    savedAt: row.saved_at || row.created_at || new Date().toISOString(),
  };
}

function mapSavedAdToDbRow(ad: SavedAd): any {
  return {
    id: ad.id,
    meta_ad_id: ad.metaAdId || null,
    advertiser_name: ad.advertiserName || "Anunciante não identificado",
    advertiser_id: ad.advertiserId || null,
    advertiser_url: ad.advertiserUrl || null,
    advertiser_library_url: ad.advertiserLibraryUrl || null,
    copy: ad.copy || "",
    cta: ad.cta || "",
    creative_type: ad.creativeType || "desconhecido",
    creative_url: ad.creativeUrl || null,
    thumbnail_url: ad.thumbnailUrl || null,
    landing_page_url: ad.landingPageUrl || null,
    meta_library_url: ad.metaLibraryUrl || null,
    start_date: ad.startDate || null,
    ad_count_current: ad.adCountCurrent ?? 1,
    days_running_current: ad.daysRunningCurrent ?? 0,
    ad_count_when_saved: ad.adCountWhenSaved ?? ad.adCountCurrent ?? 1,
    days_running_when_saved: ad.daysRunningWhenSaved ?? ad.daysRunningCurrent ?? 0,
    status_when_saved: ad.statusWhenSaved || "ativo",
    search_term: ad.searchTerm || "",
    niche: ad.niche || "Geral",
    folder: ad.folder || "Principal",
    tags: Array.isArray(ad.tags) ? ad.tags : [],
    notes: ad.notes || "",
    saved_by: ad.savedBy || "Caio (Admin)",
    saved_by_email: ad.savedByEmail || "",
    api_key: ad.apiKey || "",
    saved_at: ad.savedAt || new Date().toISOString(),
  };
}

export async function getAllOffers(): Promise<SavedAd[]> {
  // 1. Tenta carregar do Supabase se configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("saved_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar ofertas no Supabase:", error.message);
      } else if (Array.isArray(data)) {
        return data.map(mapDbRowToSavedAd);
      }
    } catch (err) {
      console.error("Exceção ao conectar no Supabase:", err);
    }
  }

  // 2. Fallback para arquivo JSON
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao ler ofertas locais:", err);
    return [];
  }
}

export async function saveOffer(ad: Partial<SavedAd> & { advertiserName?: string }): Promise<SavedAd> {
  const now = new Date().toISOString();
  const id = ad.id || `ad_${Date.now()}`;

  const newAd: SavedAd = {
    id,
    metaAdId: ad.metaAdId || null,
    advertiserName: ad.advertiserName || "Anunciante não identificado",
    advertiserId: ad.advertiserId || null,
    advertiserUrl: ad.advertiserUrl || null,
    advertiserLibraryUrl: ad.advertiserLibraryUrl || null,
    copy: ad.copy || "",
    cta: ad.cta || "",
    creativeType: ad.creativeType || "desconhecido",
    creativeUrl: ad.creativeUrl || null,
    thumbnailUrl: ad.thumbnailUrl || null,
    landingPageUrl: ad.landingPageUrl || null,
    metaLibraryUrl: ad.metaLibraryUrl || null,
    startDate: ad.startDate || null,
    adCountCurrent: ad.adCountCurrent || 1,
    daysRunningCurrent: ad.daysRunningCurrent || 0,
    adCountWhenSaved: ad.adCountWhenSaved || ad.adCountCurrent || 1,
    daysRunningWhenSaved: ad.daysRunningWhenSaved || ad.daysRunningCurrent || 0,
    statusWhenSaved: ad.statusWhenSaved || "ativo",
    searchTerm: ad.searchTerm || "",
    niche: ad.niche || "Geral",
    folder: ad.folder || "Principal",
    tags: Array.isArray(ad.tags) ? ad.tags : [],
    notes: ad.notes || "",
    savedBy: ad.savedBy || "Caio (Admin)",
    savedByEmail: ad.savedByEmail || "",
    apiKey: ad.apiKey || "",
    savedAt: ad.savedAt || now,
  };

  // 1. Tenta salvar no Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      // Se tiver metaAdId, verifica se já existe para reaproveitar o ID
      let finalId = newAd.id;
      if (newAd.metaAdId) {
        const { data: existing } = await supabase
          .from("offers")
          .select("id")
          .eq("meta_ad_id", newAd.metaAdId)
          .maybeSingle();

        if (existing?.id) {
          finalId = existing.id;
          newAd.id = finalId;
        }
      }

      const dbRow = mapSavedAdToDbRow(newAd);
      const { error } = await supabase
        .from("offers")
        .upsert(dbRow, { onConflict: "id" });

      if (error) {
        console.error("Erro ao salvar oferta no Supabase:", error.message);
      } else {
        return newAd;
      }
    } catch (err) {
      console.error("Exceção ao salvar no Supabase:", err);
    }
  }

  // 2. Fallback para arquivo JSON
  await ensureDataFile();
  const list = await getAllOffers();

  const existingIdx = list.findIndex(
    (item) =>
      (newAd.metaAdId && item.metaAdId === newAd.metaAdId) ||
      item.id === newAd.id
  );

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...newAd };
  } else {
    list.unshift(newAd);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return newAd;
}

export async function deleteOffer(id: string): Promise<boolean> {
  // 1. Tenta deletar no Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("offers")
        .delete()
        .or(`id.eq.${id},meta_ad_id.eq.${id}`);

      if (!error) return true;
      console.error("Erro ao excluir oferta no Supabase:", error.message);
    } catch (err) {
      console.error("Exceção ao deletar no Supabase:", err);
    }
  }

  // 2. Fallback para arquivo JSON
  await ensureDataFile();
  const list = await getAllOffers();
  const filtered = list.filter((item) => item.id !== id && item.metaAdId !== id);
  if (filtered.length === list.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function updateOffer(
  id: string,
  updates: Partial<Pick<SavedAd, "folder" | "niche" | "tags" | "notes">>
): Promise<SavedAd | null> {
  // 1. Tenta atualizar no Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.folder !== undefined) dbUpdates.folder = updates.folder;
      if (updates.niche !== undefined) dbUpdates.niche = updates.niche;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { data, error } = await supabase
        .from("offers")
        .update(dbUpdates)
        .or(`id.eq.${id},meta_ad_id.eq.${id}`)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapDbRowToSavedAd(data);
      }
    } catch (err) {
      console.error("Exceção ao atualizar no Supabase:", err);
    }
  }

  // 2. Fallback para arquivo JSON
  await ensureDataFile();
  const list = await getAllOffers();
  const idx = list.findIndex((item) => item.id === id || item.metaAdId === id);
  if (idx < 0) return null;

  list[idx] = { ...list[idx], ...updates };
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return list[idx];
}
