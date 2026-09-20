"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  Plus,
  Trash2,
  Paperclip,
  Camera,
  Mic,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  CheckCheck,
  Check,
  Clock,
  Shuffle,
  ImageIcon,
  MessageCircle,
  Folder,
  Heart,
  Send,
  Loader2,
  Save,
  CheckCircle,
} from "lucide-react";
import { toPng } from "html-to-image";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

type Platform = "whatsapp" | "direct_ig" | "comments_ig" | "tiktok" | "saved";
type Theme = "custom_dark" | "original_dark" | "light";

interface Message {
  id: string;
  sender: "client" | "user";
  text: string;
  time: string;
  status?: "read" | "delivered" | "sent" | "pending";
  image?: string;
}

interface SavedTestimonial {
  id: string;
  date: string;
  platform: Platform;
  contactName: string;
  messages: Message[];
}

const RANDOM_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
];

export default function TestimonialGenerator() {
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [theme, setTheme] = useState<Theme>("custom_dark");

  // Contact Info
  const [contactName, setContactName] = useState("Cliente Nat...");
  const [contactStatus, setContactStatus] = useState("online");
  const [contactAvatar, setContactAvatar] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  );

  // Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "client",
      text: "Boa tarde",
      time: "12:21",
    },
    {
      id: "2",
      sender: "client",
      text: "Meu produto acabou de chegar",
      time: "12:21",
    },
    {
      id: "3",
      sender: "client",
      text: "Ótima qualidade, e chegou antes do que o esperado. Muito obrigado mesmo !!",
      time: "12:21",
    },
    {
      id: "4",
      sender: "user",
      text: "Que bom que gostou! 🥰🌸",
      time: "01:37",
      status: "read",
    },
  ]);

  // Saved Testimonials
  const [savedTestimonials, setSavedTestimonials] = useState<SavedTestimonial[]>([]);
  const [saveAlert, setSaveAlert] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Load saved from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fluxo_saved_testimonials");
      if (stored) {
        setSavedTestimonials(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRandomAvatar = () => {
    const nextAvatars = RANDOM_AVATARS.filter((a) => a !== contactAvatar);
    const random = nextAvatars[Math.floor(Math.random() * nextAvatars.length)];
    setContactAvatar(random);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setContactAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMessage = (sender: "client" | "user") => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender,
      text: "",
      time: timeStr,
      status: sender === "user" ? "read" : undefined,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleImageUploadForMessage = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateMessage(id, { image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCurrent = () => {
    const newSaved: SavedTestimonial = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      platform,
      contactName,
      messages: [...messages],
    };
    const updated = [newSaved, ...savedTestimonials];
    setSavedTestimonials(updated);
    try {
      localStorage.setItem("fluxo_saved_testimonials", JSON.stringify(updated));
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSaved = (item: SavedTestimonial) => {
    setPlatform(item.platform);
    setContactName(item.contactName);
    setMessages(item.messages);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedTestimonials.filter((item) => item.id !== id);
    setSavedTestimonials(updated);
    try {
      localStorage.setItem("fluxo_saved_testimonials", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const exportAsPng = async () => {
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });
      const link = document.createElement("a");
      link.download = `depoimento-${platform}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao exportar imagem:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Theme styling helpers
  const getThemeBg = () => {
    if (theme === "custom_dark") return "bg-[#0b1015]";
    if (theme === "original_dark") return "bg-[#0b141a]";
    return "bg-[#efeae2]";
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Platform Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#161b22] border border-zinc-800/80 p-1.5 rounded-2xl w-fit shadow-md">
        <button
          onClick={() => setPlatform("comments_ig")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            platform === "comments_ig"
              ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <InstagramIcon className="h-4 w-4" />
          <span>Comentários IG</span>
        </button>

        <button
          onClick={() => setPlatform("direct_ig")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            platform === "direct_ig"
              ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Direct IG</span>
        </button>

        <button
          onClick={() => setPlatform("whatsapp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            platform === "whatsapp"
              ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => setPlatform("tiktok")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            platform === "tiktok"
              ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <TikTokIcon className="h-4 w-4" />
          <span>TikTok</span>
        </button>

        <button
          onClick={() => setPlatform("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            platform === "saved"
              ? "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Folder className="h-4 w-4" />
          <span>Meus Depoimentos</span>
          {savedTestimonials.length > 0 && (
            <span className="bg-purple-900/60 text-purple-200 text-xs px-1.5 py-0.2 rounded-full">
              {savedTestimonials.length}
            </span>
          )}
        </button>
      </div>

      {platform === "saved" ? (
        /* Saved Testimonials Screen */
        <div className="bg-[#161b22] border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Meus Depoimentos Salvos</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Depoimentos salvos no seu navegador para você editar ou exportar a qualquer momento.
              </p>
            </div>
            <button
              onClick={() => setPlatform("whatsapp")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-xl transition"
            >
              Voltar ao Editor
            </button>
          </div>

          {savedTestimonials.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl space-y-3">
              <Folder className="h-10 w-10 text-zinc-500 mx-auto" />
              <p className="text-zinc-400">Você ainda não salvou nenhum depoimento.</p>
              <button
                onClick={() => setPlatform("whatsapp")}
                className="text-sm text-purple-400 hover:underline"
              >
                Criar seu primeiro depoimento agora
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0e131a] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-zinc-700 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                        {item.platform}
                      </span>
                      <span className="text-xs text-zinc-500">{item.date}</span>
                    </div>
                    <h3 className="font-semibold text-zinc-200">{item.contactName}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {item.messages.find((m) => m.text)?.text || "Sem texto"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleLoadSaved(item)}
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => handleDeleteSaved(item.id)}
                      className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Editor & Preview Grid */
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Controls & Message List (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card Contato */}
            <div className="bg-[#161b22] border border-zinc-800/90 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-xs font-medium text-zinc-400">Contato</span>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src={contactAvatar}
                    alt={contactName}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-700 shadow-sm cursor-pointer group-hover:opacity-80 transition"
                    onClick={() => avatarInputRef.current?.click()}
                  />
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome do contato"
                    className="flex-1 bg-[#0d1117] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60 transition"
                  />
                  <input
                    type="text"
                    value={contactStatus}
                    onChange={(e) => setContactStatus(e.target.value)}
                    placeholder="Status"
                    className="w-28 bg-[#0d1117] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRandomAvatar}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-purple-400 transition"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Avatar aleatório</span>
                </button>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-purple-400 transition"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Enviar foto</span>
                </button>
              </div>
            </div>

            {/* Section Mensagens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-zinc-200">Mensagens</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addMessage("client")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition border border-zinc-700/50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Cliente</span>
                  </button>
                  <button
                    onClick={() => addMessage("user")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 rounded-xl text-xs font-medium transition border border-emerald-800/50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Você</span>
                  </button>
                </div>
              </div>

              {/* Message Cards List */}
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-[#161b22] border border-zinc-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-sm transition hover:border-zinc-700"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            msg.sender === "client"
                              ? "bg-zinc-800 text-zinc-300"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {msg.sender === "client" ? "Cliente" : "Você"}
                        </span>
                        <input
                          type="text"
                          value={msg.time}
                          onChange={(e) =>
                            updateMessage(msg.id, { time: e.target.value })
                          }
                          className="w-14 bg-[#0d1117] border border-zinc-800 text-center rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none focus:border-purple-500/60"
                        />
                        {msg.sender === "user" && (
                          <select
                            value={msg.status || "read"}
                            onChange={(e) =>
                              updateMessage(msg.id, {
                                status: e.target.value as Message["status"],
                              })
                            }
                            className="bg-[#0d1117] border border-zinc-800 text-xs rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none"
                          >
                            <option value="read">✓✓ On</option>
                            <option value="delivered">✓✓ Off</option>
                            <option value="sent">✓ Enviado</option>
                            <option value="pending">⏱ Pendente</option>
                          </select>
                        )}
                      </div>

                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition"
                        title="Excluir mensagem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <textarea
                      value={msg.text}
                      onChange={(e) =>
                        updateMessage(msg.id, { text: e.target.value })
                      }
                      rows={2}
                      placeholder="Digite o texto da mensagem..."
                      className="w-full bg-[#0d1117] border border-zinc-800/80 rounded-xl p-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60 resize-none transition"
                    />

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-300 transition">
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>{msg.image ? "Trocar imagem" : "Anexar imagem"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUploadForMessage(msg.id, e)
                          }
                        />
                      </label>
                      {msg.image && (
                        <button
                          onClick={() => updateMessage(msg.id, { image: undefined })}
                          className="text-red-400 hover:underline"
                        >
                          Remover imagem
                        </button>
                      )}
                    </div>

                    {msg.image && (
                      <div className="relative rounded-lg overflow-hidden border border-zinc-800 w-24 h-24 mt-1">
                        <img
                          src={msg.image}
                          alt="Anexo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview & Export (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-zinc-300">Preview</span>
                {/* Theme Selector Pills */}
                <div className="flex items-center bg-[#161b22] border border-zinc-800 p-1 rounded-xl">
                  <button
                    onClick={() => setTheme("custom_dark")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      theme === "custom_dark"
                        ? "bg-[#7c3aed] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Escuro Custom
                  </button>
                  <button
                    onClick={() => setTheme("original_dark")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      theme === "original_dark"
                        ? "bg-[#7c3aed] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Escuro Original
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      theme === "light"
                        ? "bg-[#7c3aed] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Claro
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCurrent}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition border border-zinc-700/60"
                  title="Salvar em Meus Depoimentos"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Salvar</span>
                </button>

                <button
                  onClick={exportAsPng}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 text-white font-medium text-xs rounded-xl shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>Exportar PNG</span>
                </button>
              </div>
            </div>

            {saveAlert && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>Depoimento salvo com sucesso em &quot;Meus Depoimentos&quot;!</span>
              </div>
            )}

            {/* PREVIEW CONTAINER */}
            <div className="flex justify-center p-2 sm:p-4 bg-[#090d13] border border-zinc-800/80 rounded-2xl shadow-inner">
              <div
                ref={previewRef}
                className={`w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border ${
                  theme === "light"
                    ? "border-zinc-300 text-zinc-900"
                    : "border-zinc-800 text-zinc-100"
                } ${getThemeBg()}`}
              >
                {/* PLATFORM 1: WHATSAPP MOCKUP */}
                {platform === "whatsapp" && (
                  <div className="flex flex-col min-h-[540px]">
                    {/* WhatsApp Top Header */}
                    <div
                      className={`flex items-center justify-between px-3 py-2.5 select-none ${
                        theme === "light"
                          ? "bg-[#008069] text-white"
                          : "bg-[#202c33] text-[#e9edef]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5 cursor-pointer opacity-90" />
                        <div className="relative">
                          <img
                            src={contactAvatar}
                            alt={contactName}
                            className="w-9 h-9 rounded-full object-cover border border-black/10"
                          />
                        </div>
                        <div className="leading-tight">
                          <div className="font-semibold text-sm line-clamp-1 max-w-[150px]">
                            {contactName}
                          </div>
                          <div
                            className={`text-[11px] ${
                              contactStatus === "online"
                                ? theme === "light"
                                  ? "text-emerald-200 font-medium"
                                  : "text-emerald-400 font-medium"
                                : "opacity-80"
                            }`}
                          >
                            {contactStatus}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 opacity-90">
                        <Video className="h-4 w-4 cursor-pointer" />
                        <Phone className="h-4 w-4 cursor-pointer" />
                        <MoreVertical className="h-4 w-4 cursor-pointer" />
                      </div>
                    </div>

                    {/* WhatsApp Chat Canvas */}
                    <div
                      className="flex-1 p-3 space-y-2.5 overflow-y-auto"
                      style={{
                        backgroundImage:
                          theme === "original_dark"
                            ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 1px, transparent 1px)`
                            : undefined,
                        backgroundSize: "18px 18px",
                      }}
                    >
                      {messages.map((msg) => {
                        const isUser = msg.sender === "user";
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`relative max-w-[80%] rounded-xl px-3 py-1.5 shadow-sm text-sm ${
                                isUser
                                  ? theme === "light"
                                    ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none"
                                    : "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                                  : theme === "light"
                                  ? "bg-white text-[#111b21] rounded-tl-none"
                                  : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                              }`}
                            >
                              {msg.image && (
                                <img
                                  src={msg.image}
                                  alt="Mídia"
                                  className="rounded-lg mb-1.5 max-h-48 w-full object-cover"
                                />
                              )}
                              <p className="whitespace-pre-wrap break-words leading-relaxed text-[13.5px]">
                                {msg.text}
                              </p>
                              <div
                                className={`flex items-center justify-end gap-1 text-[10px] mt-1 select-none ${
                                  isUser
                                    ? theme === "light"
                                      ? "text-zinc-600"
                                      : "text-zinc-300/80"
                                    : "text-zinc-400"
                                }`}
                              >
                                <span>{msg.time}</span>
                                {isUser && (
                                  <>
                                    {msg.status === "read" && (
                                      <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                                    )}
                                    {msg.status === "delivered" && (
                                      <CheckCheck className="h-3.5 w-3.5 text-zinc-400" />
                                    )}
                                    {msg.status === "sent" && (
                                      <Check className="h-3.5 w-3.5 text-zinc-400" />
                                    )}
                                    {msg.status === "pending" && (
                                      <Clock className="h-3 w-3 text-zinc-400" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* WhatsApp Bottom Bar */}
                    <div
                      className={`p-2 flex items-center gap-2 select-none ${
                        theme === "light" ? "bg-[#f0f2f5]" : "bg-[#202c33]"
                      }`}
                    >
                      <div
                        className={`flex-1 flex items-center gap-2.5 px-3 py-1.5 rounded-full ${
                          theme === "light"
                            ? "bg-white text-zinc-400"
                            : "bg-[#2a3942] text-zinc-400"
                        }`}
                      >
                        <Smile className="h-5 w-5" />
                        <span className="text-xs">Mensagem</span>
                        <div className="ml-auto flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <Camera className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-md">
                        <Mic className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}

                {/* PLATFORM 2: DIRECT INSTAGRAM MOCKUP */}
                {platform === "direct_ig" && (
                  <div className="flex flex-col min-h-[540px] bg-black text-white">
                    {/* IG Direct Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80">
                      <div className="flex items-center gap-3">
                        <ArrowLeft className="h-5 w-5" />
                        <img
                          src={contactAvatar}
                          alt={contactName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-xs">{contactName}</div>
                          <div className="text-[10px] text-zinc-400">Ativo(a) agora</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-300">
                        <Phone className="h-4 w-4" />
                        <Video className="h-4 w-4" />
                      </div>
                    </div>

                    {/* IG Chat Body */}
                    <div className="flex-1 p-3 space-y-3">
                      {messages.map((msg) => {
                        const isUser = msg.sender === "user";
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            {!isUser && (
                              <img
                                src={contactAvatar}
                                alt={contactName}
                                className="w-6 h-6 rounded-full object-cover mb-1"
                              />
                            )}
                            <div
                              className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                                isUser
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm"
                                  : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                              }`}
                            >
                              {msg.image && (
                                <img
                                  src={msg.image}
                                  alt="Mídia"
                                  className="rounded-lg mb-1 max-h-44 w-full object-cover"
                                />
                              )}
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* IG Footer */}
                    <div className="p-3 border-t border-zinc-800/80 flex items-center gap-3">
                      <div className="flex-1 bg-zinc-900 border border-zinc-700/50 rounded-full px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
                        <span>Mensagem...</span>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Mic className="h-4 w-4" />
                          <ImageIcon className="h-4 w-4" />
                          <Heart className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLATFORM 3: INSTAGRAM COMMENTS MOCKUP */}
                {platform === "comments_ig" && (
                  <div className="flex flex-col min-h-[540px] bg-black text-white p-4 space-y-4">
                    <div className="border-b border-zinc-800 pb-3 font-semibold text-center text-sm">
                      Comentários
                    </div>

                    <div className="space-y-4 flex-1">
                      {messages.map((msg, idx) => (
                        <div key={msg.id} className="flex items-start gap-3 text-xs">
                          <img
                            src={
                              msg.sender === "client"
                                ? contactAvatar
                                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                            }
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 space-y-1">
                            <p>
                              <span className="font-bold mr-1.5">
                                {msg.sender === "client"
                                  ? contactName.toLowerCase().replace(/\s+/g, "_")
                                  : "minhaloja_oficial"}
                              </span>
                              <span className="text-zinc-300">{msg.text}</span>
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                              <span>{idx + 1}h</span>
                              <span className="font-medium cursor-pointer">Responder</span>
                            </div>
                          </div>
                          <Heart className="h-3.5 w-3.5 text-zinc-500 cursor-pointer hover:text-red-500 transition" />
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-zinc-400">
                        Adicione um comentário...
                      </div>
                      <span className="text-xs font-semibold text-blue-500">Publicar</span>
                    </div>
                  </div>
                )}

                {/* PLATFORM 4: TIKTOK COMMENTS MOCKUP */}
                {platform === "tiktok" && (
                  <div className="flex flex-col min-h-[540px] bg-[#121212] text-white p-4 space-y-4">
                    <div className="border-b border-zinc-800 pb-3 font-semibold text-center text-sm">
                      {messages.length} comentários
                    </div>

                    <div className="space-y-4 flex-1">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 text-xs">
                          <img
                            src={
                              msg.sender === "client"
                                ? contactAvatar
                                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                            }
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 space-y-1">
                            <span className="font-bold text-zinc-400">
                              {msg.sender === "client"
                                ? `@${contactName.toLowerCase().replace(/\s+/g, "")}`
                                : "@criador"}
                            </span>
                            <p className="text-zinc-100">{msg.text}</p>
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                              <span>Há 2d</span>
                              <span className="font-semibold cursor-pointer">Responder</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-0.5 text-zinc-400 text-[10px]">
                            <Heart className="h-3.5 w-3.5" />
                            <span>12</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                      <div className="flex-1 bg-zinc-800/60 rounded-full px-4 py-2 text-xs text-zinc-400">
                        Adicionar comentário...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
