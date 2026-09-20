import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface ApiKey {
  key: string;
  userName: string;
  userEmail?: string;
  role: "admin" | "miner";
  createdAt: string;
  lastUsedAt?: string;
}

const isServerless = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless ? "/tmp" : path.join(process.cwd(), "data");
const KEYS_FILE = path.join(DATA_DIR, "api-keys.json");
const BUNDLED_FILE = path.join(process.cwd(), "data", "api-keys.json");

const SEED_KEYS: ApiKey[] = [
  {
    key: "fo_live_admin_master88",
    userName: "Caio (Admin)",
    userEmail: "caio@fluxooffer.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    key: "fo_live_miner_joao42",
    userName: "João (Minerador)",
    userEmail: "joao.miner@gmail.com",
    role: "miner",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    key: "fo_live_miner_maria19",
    userName: "Maria (Copywriter)",
    userEmail: "maria.copy@gmail.com",
    role: "miner",
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
];

async function ensureKeysFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(KEYS_FILE);
    } catch {
      let initialData = SEED_KEYS;
      try {
        const bundledRaw = await fs.readFile(BUNDLED_FILE, "utf-8");
        const parsed = JSON.parse(bundledRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialData = parsed;
        }
      } catch {}
      await fs.writeFile(KEYS_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Erro ao inicializar arquivo de chaves:", err);
  }
}

export async function getAllApiKeys(): Promise<ApiKey[]> {
  await ensureKeysFile();
  try {
    const raw = await fs.readFile(KEYS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao ler chaves de API:", err);
    return [];
  }
}

export async function createApiKey(
  userName: string,
  userEmail?: string,
  role: "admin" | "miner" = "miner"
): Promise<ApiKey> {
  await ensureKeysFile();
  const keys = await getAllApiKeys();

  // Gera chave segura no formato fo_live_<user>_<hash>
  const slug = userName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const randomHex = crypto.randomBytes(4).toString("hex");
  const key = `fo_live_${slug}_${randomHex}`;

  const newKey: ApiKey = {
    key,
    userName,
    userEmail: userEmail || "",
    role,
    createdAt: new Date().toISOString(),
  };

  keys.unshift(newKey);
  await fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
  return newKey;
}

export async function deleteApiKey(key: string): Promise<boolean> {
  await ensureKeysFile();
  const keys = await getAllApiKeys();
  const filtered = keys.filter((k) => k.key !== key);
  if (filtered.length === keys.length) return false;

  await fs.writeFile(KEYS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function validateApiKey(keyToValidate: string): Promise<ApiKey | null> {
  if (!keyToValidate) return null;
  const cleanKey = keyToValidate.replace(/^Bearer\s+/i, "").trim();
  const keys = await getAllApiKeys();

  const found = keys.find((k) => k.key === cleanKey);
  if (found) {
    // Atualiza lastUsedAt silenciosamente
    found.lastUsedAt = new Date().toISOString();
    fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8").catch(() => {});
    return found;
  }
  return null;
}
