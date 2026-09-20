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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "offers.json");

const SEED_OFFERS: SavedAd[] = [
  {
    id: "ad_1710931200000",
    metaAdId: "148293849201948",
    advertiserName: "Dr. Vitalis - Fórmula Natural",
    advertiserId: "1029384756",
    advertiserUrl: "https://facebook.com/drvitalis",
    advertiserLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&view_all_page_id=1029384756",
    copy: "Descubra o ritual matinal de 7 segundos que está transformando a disposição de homens e mulheres acima de 40 anos. Sem dietas restritivas e 100% natural. Assista à apresentação exclusiva antes que saia do ar.",
    cta: "Saiba Mais",
    creativeType: "vídeo",
    creativeUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    landingPageUrl: "https://drvitalis.com.br/protocolo-vsl",
    metaLibraryUrl: "https://www.facebook.com/ads/library/?id=148293849201948",
    startDate: "2026-07-15",
    adCountCurrent: 24,
    daysRunningCurrent: 67,
    adCountWhenSaved: 24,
    daysRunningWhenSaved: 67,
    statusWhenSaved: "ativo",
    searchTerm: "saude natural",
    niche: "Saúde & Bem-Estar",
    folder: "Alta Escala",
    tags: ["vsl", "black", "promessa-forte", "ritual"],
    notes: "Oferta rodando há mais de 2 meses com 24 variações ativas. VSL muito bem estruturada com lead curiosa.",
    savedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "ad_1710931200001",
    metaAdId: "98327491028374",
    advertiserName: "Lumina Glow Cosméticos",
    advertiserId: "982736451",
    advertiserUrl: "https://facebook.com/luminaglow",
    advertiserLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&view_all_page_id=982736451",
    copy: "Adeus manchas escuras e linhas de expressão! O sérum que viralizou no TikTok agora com frete grátis para todo o Brasil. Aproveite 40% OFF apenas hoje.",
    cta: "Comprar Agora",
    creativeType: "imagem",
    creativeUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    landingPageUrl: "https://luminaglow.com.br/promocao-serum",
    metaLibraryUrl: "https://www.facebook.com/ads/library/?id=98327491028374",
    startDate: "2026-08-01",
    adCountCurrent: 14,
    daysRunningCurrent: 50,
    adCountWhenSaved: 14,
    daysRunningWhenSaved: 50,
    statusWhenSaved: "ativo",
    searchTerm: "clareador de manchas",
    niche: "Beleza & Skincare",
    folder: "Dropshipping",
    tags: ["direto", "antes-depois", "ugc"],
    notes: "UGC com alta conversão, modelo direto ao ponto com gatilho de escassez e frete grátis.",
    savedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: "ad_1710931200002",
    metaAdId: "57483920194857",
    advertiserName: "Academia do Tráfego Direto",
    advertiserId: "564738291",
    advertiserUrl: "https://facebook.com/trafegodireto",
    advertiserLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&view_all_page_id=564738291",
    copy: "Como minerar ofertas de 6 dígitos em menos de 15 minutos usando a Biblioteca da Meta sem gastar 1 real com ferramentas caras. Masterclass gratuita liberada por tempo limitado.",
    cta: "Cadastre-se",
    creativeType: "vídeo",
    creativeUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    landingPageUrl: "https://academiadotrafego.com.br/masterclass-mineracao",
    metaLibraryUrl: "https://www.facebook.com/ads/library/?id=57483920194857",
    startDate: "2026-08-20",
    adCountCurrent: 8,
    daysRunningCurrent: 31,
    adCountWhenSaved: 8,
    daysRunningWhenSaved: 31,
    statusWhenSaved: "ativo",
    searchTerm: "mineracao de ofertas",
    niche: "Marketing & Negócios",
    folder: "Infoproduto",
    tags: ["lead", "captura", "aula-gratuita"],
    notes: "Gancho focado em economia de ferramentas pagas. Ótima copy de quebra de objeção.",
    savedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(SEED_OFFERS, null, 2), "utf-8");
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
    // Atualiza mantendo dados
    list[existingIdx] = { ...list[existingIdx], ...newAd };
  } else {
    // Adiciona no topo
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
