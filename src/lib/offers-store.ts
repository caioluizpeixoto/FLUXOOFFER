import fs from "fs/promises";
import path from "path";

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
        // Usa SEED_OFFERS padrão
      }
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Erro ao garantir arquivo de dados do cofre:", err);
  }
}

export async function getAllOffers(): Promise<SavedAd[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao ler ofertas:", err);
    return [];
  }
}

export async function saveOffer(ad: Partial<SavedAd> & { advertiserName?: string }): Promise<SavedAd> {
  await ensureDataFile();
  const list = await getAllOffers();

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

  // Deduplica por metaAdId ou id
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
  await ensureDataFile();
  const list = await getAllOffers();
  const idx = list.findIndex((item) => item.id === id || item.metaAdId === id);
  if (idx < 0) return null;

  list[idx] = { ...list[idx], ...updates };
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return list[idx];
}
