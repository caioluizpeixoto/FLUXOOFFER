import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { supabase, isSupabaseConfigured } from "./supabase";

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
    key: "fo_live_caio_master",
    userName: "Caio (Admin)",
    userEmail: "caio@fluxooffer.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    key: "fo_live_admin_master88",
    userName: "Caio (Admin Master)",
    userEmail: "caio@fluxooffer.com",
    role: "admin",
    createdAt: new Date().toISOString(),
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

function mapDbRowToApiKey(row: any): ApiKey {
  return {
    key: row.key,
    userName: row.user_name || "Membro",
    userEmail: row.user_email || "",
    role: row.role || "miner",
    createdAt: row.created_at || new Date().toISOString(),
    lastUsedAt: row.last_used_at || undefined,
  };
}

export async function getAllApiKeys(): Promise<ApiKey[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapDbRowToApiKey);
      }
    } catch (err) {
      console.error("Erro ao ler chaves do Supabase:", err);
    }
  }

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
  // Gera chave segura no formato fo_live_<user>_<hash>
  const slug = userName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const randomHex = crypto.randomBytes(4).toString("hex");
  const key = `fo_live_${slug}_${randomHex}`;
  const now = new Date().toISOString();

  const newKey: ApiKey = {
    key,
    userName,
    userEmail: userEmail || "",
    role,
    createdAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("api_keys").insert({
        key,
        user_name: userName,
        user_email: userEmail || "",
        role,
        created_at: now,
      });

      if (!error) return newKey;
      console.error("Erro ao criar chave no Supabase:", error.message);
    } catch (err) {
      console.error("Exceção ao criar chave no Supabase:", err);
    }
  }

  await ensureKeysFile();
  const keys = await getAllApiKeys();
  keys.unshift(newKey);
  await fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
  return newKey;
}

export async function deleteApiKey(key: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("key", key);
      if (!error) return true;
    } catch (err) {
      console.error("Erro ao deletar chave no Supabase:", err);
    }
  }

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

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("key", cleanKey)
        .maybeSingle();

      if (!error && data) {
        const found = mapDbRowToApiKey(data);
        const now = new Date().toISOString();
        supabase
          .from("api_keys")
          .update({ last_used_at: now })
          .eq("key", cleanKey)
          .then();
        return found;
      }
    } catch (err) {
      console.error("Erro ao validar chave no Supabase:", err);
    }
  }

  const keys = await getAllApiKeys();
  const found = keys.find((k) => k.key === cleanKey);
  if (found) {
    found.lastUsedAt = new Date().toISOString();
    fs.writeFile(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8").catch(() => {});
    return found;
  }
  return null;
}
