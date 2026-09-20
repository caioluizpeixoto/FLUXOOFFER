"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  FolderPlus,
  Tag,
  Play,
  FileText,
  Layers,
  Sparkles,
  TrendingUp,
  X,
  Share2,
  Key,
  User,
  Users,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { SavedAd } from "@/lib/offers-store";

interface ApiKeyItem {
  key: string;
  userName: string;
  userEmail?: string;
  role: string;
  createdAt: string;
  lastUsedAt?: string;
}

export default function SwipeFilePage() {
  const [offers, setOffers] = useState<SavedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("Todas");
  const [selectedNiche, setSelectedNiche] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedMiner, setSelectedMiner] = useState("Todos");
  const [sortBy, setSortBy] = useState<"escalados" | "variacoes" | "dias" | "recentes">("escalados");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAdDetail, setActiveAdDetail] = useState<SavedAd | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // API Keys / Team modal state
  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyUser, setNewKeyUser] = useState({ name: "", email: "" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // New manual ad form state
  const [newAd, setNewAd] = useState<Partial<SavedAd>>({
    advertiserName: "",
    copy: "",
    creativeType: "vídeo",
    creativeUrl: "",
    thumbnailUrl: "",
    landingPageUrl: "",
    niche: "Geral",
    folder: "Principal",
    adCountCurrent: 1,
    daysRunningCurrent: 1,
    savedBy: "Caio (Admin)",
    tags: [],
    notes: "",
  });

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOffers(data.data);
      }
    } catch (err) {
      console.error("Erro ao carregar ofertas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApiKeys(data.data);
      }
    } catch (err) {
      console.error("Erro ao carregar chaves de API:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Deseja realmente remover esta oferta do Cofre?")) return;

    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o.id !== id && o.metaAdId !== id));
        if (activeAdDetail?.id === id || activeAdDetail?.metaAdId === id) {
          setActiveAdDetail(null);
        }
      }
    } catch (err) {
      console.error("Erro ao excluir oferta:", err);
    }
  };

  const handleCopy = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAd,
          adCountWhenSaved: newAd.adCountCurrent,
          daysRunningWhenSaved: newAd.daysRunningCurrent,
          statusWhenSaved: "ativo",
        }),
      });
      const data = await res.json();
      if (data.success && data.ad) {
        setOffers((prev) => [data.ad, ...prev]);
        setIsNewModalOpen(false);
        setNewAd({
          advertiserName: "",
          copy: "",
          creativeType: "vídeo",
          creativeUrl: "",
          thumbnailUrl: "",
          landingPageUrl: "",
          niche: "Geral",
          folder: "Principal",
          adCountCurrent: 1,
          daysRunningCurrent: 1,
          savedBy: "Caio (Admin)",
          tags: [],
          notes: "",
        });
      }
    } catch (err) {
      console.error("Erro ao criar oferta manual:", err);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyUser.name.trim()) return;

    try {
      setIsCreatingKey(true);
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: newKeyUser.name,
          userEmail: newKeyUser.email,
          role: "miner",
        }),
      });
      const data = await res.json();
      if (data.success && data.key) {
        setApiKeys((prev) => [data.key, ...prev]);
        setNewKeyUser({ name: "", email: "" });
      }
    } catch (err) {
      console.error("Erro ao gerar chave:", err);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleDeleteApiKey = async (key: string) => {
    if (!confirm("Deseja realmente revogar esta chave? A extensão desse usuário será desconectada.")) return;

    try {
      const res = await fetch(`/api/keys?key=${key}`, { method: "DELETE" });
      if (res.ok) {
        setApiKeys((prev) => prev.filter((k) => k.key !== key));
      }
    } catch (err) {
      console.error("Erro ao revogar chave:", err);
    }
  };

  const handleSaveNotes = async (id: string, notes: string, folder: string, niche: string) => {
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, folder, niche }),
      });
      const data = await res.json();
      if (data.success && data.ad) {
        setOffers((prev) =>
          prev.map((o) => (o.id === id || o.metaAdId === id ? { ...o, notes, folder, niche } : o))
        );
        setActiveAdDetail((prev) => (prev ? { ...prev, notes, folder, niche } : null));
      }
    } catch (err) {
      console.error("Erro ao salvar anotações:", err);
    }
  };

  // Unique folders, niches, and miners
  const folders = useMemo(() => {
    const set = new Set<string>(["Todas"]);
    offers.forEach((o) => o.folder && set.add(o.folder));
    return Array.from(set);
  }, [offers]);

  const niches = useMemo(() => {
    const set = new Set<string>(["Todos"]);
    offers.forEach((o) => o.niche && set.add(o.niche));
    return Array.from(set);
  }, [offers]);

  const miners = useMemo(() => {
    const set = new Set<string>(["Todos"]);
    offers.forEach((o) => o.savedBy && set.add(o.savedBy));
    return Array.from(set);
  }, [offers]);

  // Filter & Sort
  const filteredOffers = useMemo(() => {
    return offers
      .filter((ad) => {
        const matchesSearch =
          !searchTerm ||
          ad.advertiserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.copy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.savedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFolder = selectedFolder === "Todas" || ad.folder === selectedFolder;
        const matchesNiche = selectedNiche === "Todos" || ad.niche === selectedNiche;
        const matchesStatus =
          selectedStatus === "todos" || ad.statusWhenSaved === selectedStatus;
        const matchesMiner =
          selectedMiner === "Todos" || (ad.savedBy || "Caio (Admin)") === selectedMiner;

        return matchesSearch && matchesFolder && matchesNiche && matchesStatus && matchesMiner;
      })
      .sort((a, b) => {
        const countA = a.adCountWhenSaved || a.adCountCurrent || 1;
        const countB = b.adCountWhenSaved || b.adCountCurrent || 1;
        const daysA = a.daysRunningWhenSaved || a.daysRunningCurrent || 0;
        const daysB = b.daysRunningWhenSaved || b.daysRunningCurrent || 0;

        if (sortBy === "escalados") {
          const scoreA = countA * 10 + daysA;
          const scoreB = countB * 10 + daysB;
          return scoreB - scoreA;
        }
        if (sortBy === "variacoes") return countB - countA;
        if (sortBy === "dias") return daysB - daysA;
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      });
  }, [offers, searchTerm, selectedFolder, selectedNiche, selectedStatus, selectedMiner, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = offers.length;
    const scaled = offers.filter(
      (o) =>
        (o.adCountWhenSaved || o.adCountCurrent || 0) >= 10 ||
        (o.daysRunningWhenSaved || o.daysRunningCurrent || 0) >= 30
    ).length;
    const totalDays = offers.reduce(
      (acc, o) => acc + (o.daysRunningWhenSaved || o.daysRunningCurrent || 0),
      0
    );
    const avgDays = total > 0 ? Math.round(totalDays / total) : 0;
    const nicheCount = new Set(offers.map((o) => o.niche).filter(Boolean)).size;

    return { total, scaled, avgDays, nicheCount };
  }, [offers]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Anunciante",
      "Minerado Por",
      "Variações",
      "Dias Rodando",
      "Status",
      "Nicho",
      "Pasta",
      "Página de Vendas",
      "Biblioteca Meta",
      "Copy",
      "Data de Salvamento",
    ];

    const rows = filteredOffers.map((o) => [
      `"${o.metaAdId || o.id}"`,
      `"${(o.advertiserName || "").replace(/"/g, '""')}"`,
      `"${(o.savedBy || "Caio (Admin)").replace(/"/g, '""')}"`,
      o.adCountWhenSaved || o.adCountCurrent || 1,
      o.daysRunningWhenSaved || o.daysRunningCurrent || 0,
      `"${o.statusWhenSaved || "ativo"}"`,
      `"${o.niche || ""}"`,
      `"${o.folder || ""}"`,
      `"${o.landingPageUrl || ""}"`,
      `"${o.metaLibraryUrl || o.advertiserLibraryUrl || ""}"`,
      `"${(o.copy || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${o.savedAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cofre-de-ofertas-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-zinc-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111722] border border-zinc-800/80 p-6 rounded-2xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cofre de Ofertas</h1>
              <p className="text-xs text-zinc-400">
                Mineração contínua e análise de anúncios escalados sincronizados com o{" "}
                <span className="text-purple-400 font-semibold">FluxoMiner</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Connection Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FluxoMiner Conectado (API Online)</span>
          </div>

          <button
            onClick={() => {
              fetchApiKeys();
              setIsKeysModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-950/60 hover:bg-purple-900/70 text-purple-300 border border-purple-700/50 rounded-xl text-xs font-medium transition shadow-sm"
            title="Gerenciar Chaves de API para membros da equipe"
          >
            <Key className="h-4 w-4" />
            <span>Equipe & Chaves</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-purple-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Oferta</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition border border-zinc-700/60"
            title="Exportar dados filtrados em CSV"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={fetchOffers}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition border border-zinc-700/60"
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111722] border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total no Cofre</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{stats.total}</div>
          <div className="text-[11px] text-zinc-500">ofertas salvas</div>
        </div>

        <div className="bg-[#111722] border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Alta Escala</span>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{stats.scaled}</div>
          <div className="text-[11px] text-zinc-500">≥10 variações ou ≥30 dias</div>
        </div>

        <div className="bg-[#111722] border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Média de Dias</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.avgDays} dias</div>
          <div className="text-[11px] text-zinc-500">tempo médio rodando</div>
        </div>

        <div className="bg-[#111722] border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Nichos Rastreados</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.nicheCount}</div>
          <div className="text-[11px] text-zinc-500">categorias mapeadas</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111722] border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por anunciante, texto da copy, minerador ou nicho..."
              className="w-full bg-[#090d14] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>

          {/* Minerador Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Minerador:</span>
            <select
              value={selectedMiner}
              onChange={(e) => setSelectedMiner(e.target.value)}
              className="bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            >
              {miners.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Pasta:</span>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            >
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Niche Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Nicho:</span>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            >
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="escalados">🔥 Mais Escalados</option>
              <option value="variacoes">📦 Mais Variações</option>
              <option value="dias">⏳ Mais Dias Rodando</option>
              <option value="recentes">⚡ Mais Recentes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-[#111722] border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <Layers className="h-12 w-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-200">Nenhuma oferta encontrada</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Nenhum anúncio corresponde aos filtros atuais. Use a extensão{" "}
              <strong className="text-purple-400">FluxoMiner</strong> na Biblioteca da Meta para minerar e salvar ofertas com 1 clique!
            </p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium transition"
          >
            Adicionar Oferta Manual
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((ad) => {
            const adCount = ad.adCountWhenSaved || ad.adCountCurrent || 1;
            const daysRunning = ad.daysRunningWhenSaved || ad.daysRunningCurrent || 0;
            const isScaled = adCount >= 10 || daysRunning >= 30;

            return (
              <div
                key={ad.id}
                onClick={() => setActiveAdDetail(ad)}
                className={`group bg-[#111722] border rounded-2xl overflow-hidden flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                  isScaled
                    ? "border-purple-500/30 hover:border-purple-500/60"
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div>
                  {/* Card Media Preview */}
                  <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                    {ad.thumbnailUrl ? (
                      <img
                        src={ad.thumbnailUrl}
                        alt={ad.advertiserName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Play className="h-10 w-10 opacity-40" />
                      </div>
                    )}

                    {/* Creative Type Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-zinc-300 border border-white/10">
                      {ad.creativeType || "Criativo"}
                    </span>

                    {/* Scale Badge */}
                    {isScaled && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold shadow-lg flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>ESCALADO</span>
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Advertiser & Niche */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200 line-clamp-1">
                          {ad.advertiserName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {ad.folder || "Principal"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-purple-400 font-medium">
                          {ad.niche || "Geral"}
                        </span>
                        {/* Minerador que salvou */}
                        <span className="text-zinc-400 flex items-center gap-1 text-[10px]">
                          <User className="h-3 w-3 text-purple-400" />
                          <span className="line-clamp-1">{ad.savedBy || "Caio (Admin)"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Scale Telemetry Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                          adCount >= 10
                            ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <Flame className="h-3 w-3" />
                        <span>{adCount} variações</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                          daysRunning >= 30
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{daysRunning} dias</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase ${
                          ad.statusWhenSaved === "ativo"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {ad.statusWhenSaved || "ativo"}
                      </span>
                    </div>

                    {/* Ad Copy Snippet */}
                    <div className="relative bg-[#090d14] rounded-xl p-3 border border-zinc-800/80 group/copy">
                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                        {ad.copy || "Sem texto de anúncio capturado."}
                      </p>
                      <button
                        onClick={(e) => handleCopy(ad.id, ad.copy, e)}
                        className="mt-2 flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition"
                      >
                        {copiedId === ad.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copy copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copiar Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Notes / Tags */}
                    {ad.tags && ad.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ad.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 bg-zinc-800/60 text-zinc-400 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-zinc-800/60 mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ad.landingPageUrl && (
                      <a
                        href={ad.landingPageUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg flex items-center gap-1 transition"
                        title="Abrir Página de Vendas da Oferta"
                      >
                        <span>Pág. Vendas</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {(ad.metaLibraryUrl || ad.advertiserLibraryUrl) && (
                      <a
                        href={ad.metaLibraryUrl || ad.advertiserLibraryUrl || ""}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 bg-blue-950/60 hover:bg-blue-900/70 text-blue-300 text-xs rounded-lg flex items-center gap-1 transition border border-blue-800/40"
                        title="Ver Anúncios na Biblioteca da Meta"
                      >
                        <span>Meta</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleDelete(ad.id, e)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Excluir do Cofre"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {activeAdDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveAdDetail(null)}
        >
          <div
            className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">
                  {activeAdDetail.advertiserName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                  <span>ID: {activeAdDetail.metaAdId || activeAdDetail.id}</span>
                  <span>•</span>
                  <span>Salvo por: <strong className="text-purple-400">{activeAdDetail.savedBy || "Caio (Admin)"}</strong></span>
                  <span>•</span>
                  <span>Data: {new Date(activeAdDetail.savedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveAdDetail(null)}
                className="p-1 text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Media & Snapshot */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
                  {activeAdDetail.creativeUrl && activeAdDetail.creativeType.includes("v") ? (
                    <video
                      src={activeAdDetail.creativeUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : activeAdDetail.thumbnailUrl ? (
                    <img
                      src={activeAdDetail.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500">Sem preview de mídia</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {activeAdDetail.creativeUrl && (
                    <a
                      href={activeAdDetail.creativeUrl}
                      target="_blank"
                      download
                      className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium text-center transition"
                    >
                      Baixar Mídia
                    </a>
                  )}
                  {activeAdDetail.landingPageUrl && (
                    <a
                      href={activeAdDetail.landingPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Acessar LP</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Metrics Snapshot */}
              <div className="space-y-4">
                <div className="bg-[#090d14] p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Snapshot Imutável
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500">Variações:</span>
                      <div className="font-bold text-orange-400 text-sm">
                        {activeAdDetail.adCountWhenSaved || activeAdDetail.adCountCurrent}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Dias Rodando:</span>
                      <div className="font-bold text-amber-400 text-sm">
                        {activeAdDetail.daysRunningWhenSaved || activeAdDetail.daysRunningCurrent} dias
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Nicho:</span>
                      <div className="font-medium text-zinc-300">
                        {activeAdDetail.niche || "Geral"}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Pasta:</span>
                      <div className="font-medium text-zinc-300">
                        {activeAdDetail.folder || "Principal"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">
                    Anotações de Inteligência & Ganchos:
                  </label>
                  <textarea
                    value={activeAdDetail.notes || ""}
                    onChange={(e) =>
                      setActiveAdDetail({ ...activeAdDetail, notes: e.target.value })
                    }
                    rows={4}
                    placeholder="Escreva suas análises desta oferta..."
                    className="w-full bg-[#090d14] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/60"
                  />
                  <button
                    onClick={() =>
                      handleSaveNotes(
                        activeAdDetail.id,
                        activeAdDetail.notes || "",
                        activeAdDetail.folder || "Principal",
                        activeAdDetail.niche || "Geral"
                      )
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                  >
                    Salvar Anotações
                  </button>
                </div>
              </div>
            </div>

            {/* Full Copy */}
            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Copy do Anúncio
                </h4>
                <button
                  onClick={() => handleCopy(activeAdDetail.id, activeAdDetail.copy)}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar Tudo</span>
                </button>
              </div>
              <div className="bg-[#090d14] p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {activeAdDetail.copy}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEAM & API KEYS MODAL */}
      {isKeysModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsKeysModalOpen(false)}
        >
          <div
            className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Key className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="font-bold text-base text-zinc-100">Equipe & Chaves de API</h3>
                  <p className="text-xs text-zinc-400">
                    Gere chaves para cada membro da sua equipe para saber quem salvou cada oferta.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKeysModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Create Key Form */}
            <form onSubmit={handleCreateApiKey} className="bg-[#090d14] p-4 rounded-xl border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-zinc-300">Criar Chave para Novo Membro</span>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-zinc-400">Nome do Membro / Minerador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Minerador"
                    value={newKeyUser.name}
                    onChange={(e) => setNewKeyUser({ ...newKeyUser, name: e.target.value })}
                    className="w-full bg-[#111722] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 mt-1 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Email (Opcional)</label>
                  <input
                    type="email"
                    placeholder="joao@equipe.com"
                    value={newKeyUser.email}
                    onChange={(e) => setNewKeyUser({ ...newKeyUser, email: e.target.value })}
                    className="w-full bg-[#111722] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 mt-1 focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingKey || !newKeyUser.name.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium transition disabled:opacity-50"
                >
                  {isCreatingKey ? "Gerando..." : "Gerar Chave de API"}
                </button>
              </div>
            </form>

            {/* Keys List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-300">Chaves Ativas ({apiKeys.length})</span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {apiKeys.map((item) => (
                  <div
                    key={item.key}
                    className="bg-[#090d14] border border-zinc-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-200">{item.userName}</span>
                        {item.role === "admin" && (
                          <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded text-[10px] font-bold">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                          {item.key}
                        </code>
                        <button
                          onClick={() => handleCopyKey(item.key)}
                          className="text-zinc-400 hover:text-zinc-200 text-xs transition"
                          title="Copiar Chave"
                        >
                          {copiedKey === item.key ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      {item.userEmail && (
                        <p className="text-[11px] text-zinc-500">{item.userEmail}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteApiKey(item.key)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Revogar Chave"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Instruction Box */}
            <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 text-xs text-purple-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Como os mineradores usam:</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                1. Cada membro copia a sua chave gerada acima.<br />
                2. Na extensão <strong>FluxoMiner</strong>, clica no ícone da extensão no Chrome e cola a chave.<br />
                3. Ao clicar em &quot;Salvar no Cofre&quot;, o FluxoOffer reconhecerá automaticamente quem salvou!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NEW MANUAL MODAL */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="bg-[#111722] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-zinc-100">Adicionar Oferta Manual</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400">Nome do Anunciante / Produto *</label>
                <input
                  type="text"
                  required
                  value={newAd.advertiserName || ""}
                  onChange={(e) => setNewAd({ ...newAd, advertiserName: e.target.value })}
                  placeholder="Ex: Fórmula Sono Perfeito"
                  className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400">Minerado Por (Usuário)</label>
                  <input
                    type="text"
                    value={newAd.savedBy || ""}
                    onChange={(e) => setNewAd({ ...newAd, savedBy: e.target.value })}
                    placeholder="Ex: Caio (Admin)"
                    className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Nicho</label>
                  <input
                    type="text"
                    value={newAd.niche || ""}
                    onChange={(e) => setNewAd({ ...newAd, niche: e.target.value })}
                    placeholder="Ex: Saúde & Bem-Estar"
                    className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400">Pasta</label>
                  <input
                    type="text"
                    value={newAd.folder || ""}
                    onChange={(e) => setNewAd({ ...newAd, folder: e.target.value })}
                    placeholder="Ex: Principal, VSLs"
                    className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Variações / Anúncios</label>
                  <input
                    type="number"
                    value={newAd.adCountCurrent || 1}
                    onChange={(e) =>
                      setNewAd({ ...newAd, adCountCurrent: Number(e.target.value) })
                    }
                    className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Link da Página de Vendas (LP)</label>
                <input
                  type="url"
                  value={newAd.landingPageUrl || ""}
                  onChange={(e) => setNewAd({ ...newAd, landingPageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400">URL da Imagem / Thumbnail</label>
                <input
                  type="url"
                  value={newAd.thumbnailUrl || ""}
                  onChange={(e) => setNewAd({ ...newAd, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#090d14] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400">Copy do Anúncio</label>
                <textarea
                  value={newAd.copy || ""}
                  onChange={(e) => setNewAd({ ...newAd, copy: e.target.value })}
                  rows={3}
                  placeholder="Cole aqui a copy..."
                  className="w-full bg-[#090d14] border border-zinc-800 rounded-xl p-3 text-zinc-200 mt-1 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition"
                >
                  Salvar no Cofre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
