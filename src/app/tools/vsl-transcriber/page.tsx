"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Mic,
  MicOff,
  FileText,
  Copy,
  CheckCircle2,
  Download,
  Clock,
  Sparkles,
  Flame,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  Upload,
  FileVideo,
  FileAudio,
  Play,
  Pause,
  Key,
  Film,
  Image as ImageIcon,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface StructuredPillars {
  hook: string;
  storyMechanism: string;
  offer: string;
  cta: string;
}

interface VaultAd {
  id: string;
  advertiserName: string;
  creativeUrl: string | null;
  thumbnailUrl: string | null;
  creativeType: string;
  niche?: string;
  copy?: string;
}

export default function VslTranscriber() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload de arquivo local (vídeo/áudio da galeria ou máquina)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isVideoFile, setIsVideoFile] = useState<boolean>(true);
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isTranscribingFile, setIsTranscribingFile] = useState<boolean>(false);
  const [isPlayingSync, setIsPlayingSync] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Vídeos salvos no Cofre de Ofertas (Galeria Pessoal)
  const [vaultVideos, setVaultVideos] = useState<VaultAd[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState<boolean>(true);

  // Áudio ao vivo via Web Speech API
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptAudio, setTranscriptAudio] = useState("");
  const recognitionRef = useRef<any>(null);

  // Resultado da transcrição
  const [title, setTitle] = useState<string>("");
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [pillars, setPillars] = useState<StructuredPillars | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Carrega vídeos do Cofre
  useEffect(() => {
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const vids = data.filter(
            (ad: any) =>
              ad.creativeUrl ||
              (ad.creativeType && ad.creativeType.toLowerCase().includes("v"))
          );
          setVaultVideos(vids);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingVault(false));
  }, []);

  // Carrega chave OpenAI e query params (ex: vindo direto do Cofre)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("fluxooffer_openai_key");
      if (savedKey) setOpenAiKey(savedKey);

      const params = new URLSearchParams(window.location.search);
      const paramVideoUrl = params.get("videoUrl");
      const paramTitle = params.get("title");
      if (paramVideoUrl) {
        setFilePreviewUrl(paramVideoUrl);
        setTitle(paramTitle || "Vídeo da Galeria");
        setIsVideoFile(true);
        setActiveTab("gallery");
      }
    }
  }, []);

  // Configura Web Speech API para gravação de áudio e sincronização
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "pt-BR";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscriptAudio((prev) => {
            const trimmed = currentTranscript.trim();
            return trimmed.length > 0 ? trimmed : prev;
          });
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
          setIsPlayingSync(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setIsPlayingSync(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
      window.URL.revokeObjectURL(filePreviewUrl);
    }

    const objectUrl = window.URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(objectUrl);
    setTitle(file.name);
    setIsVideoFile(file.type.startsWith("video/") || !file.type.startsWith("audio/"));
    setErrorMessage(null);
    setTranscriptAudio("");
  };

  const handleSelectFromVault = (ad: VaultAd) => {
    if (!ad.creativeUrl) {
      alert("Esta oferta não possui link de vídeo direto cadastrado.");
      return;
    }

    setSelectedFile(null);
    setFilePreviewUrl(ad.creativeUrl);
    setTitle(ad.advertiserName || "Vídeo do Cofre");
    setIsVideoFile(true);
    setErrorMessage(null);
    setTranscriptAudio("");
    setActiveTab("gallery");
  };

  const handleOpenAiKeyChange = (val: string) => {
    setOpenAiKey(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxooffer_openai_key", val);
    }
  };

  // Transcrição de arquivo via API (OpenAI Whisper)
  const handleTranscribeWithWhisper = async () => {
    if (!selectedFile && !filePreviewUrl) return;

    setIsTranscribingFile(true);
    setErrorMessage(null);

    try {
      let fileToSend: File | Blob | null = selectedFile;

      // Se for uma URL remota do cofre, busca o blob primeiro
      if (!fileToSend && filePreviewUrl) {
        const fetchedBlob = await fetch(filePreviewUrl).then((r) => r.blob());
        fileToSend = new File([fetchedBlob], `${title || "video"}.mp4`, { type: "video/mp4" });
      }

      if (!fileToSend) {
        throw new Error("Nenhum arquivo ou URL válida para transcrever.");
      }

      const formData = new FormData();
      formData.append("file", fileToSend);
      if (openAiKey.trim()) {
        formData.append("apiKey", openAiKey.trim());
      }

      const res = await fetch("/api/transcribe-file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.needsApiKey) {
          setShowKeyInput(true);
        }
        throw new Error(data.error || "Falha ao processar arquivo no servidor.");
      }

      structureTranscript(data.transcript, title || selectedFile?.name);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao processar arquivo.");
    } finally {
      setIsTranscribingFile(false);
    }
  };

  // Transcrição por reprodução do vídeo sincronizado com Web Speech
  const togglePlaySync = () => {
    if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz direto. Recomendamos o Google Chrome ou Edge.");
      return;
    }

    const mediaElement = isVideoFile ? videoPlayerRef.current : audioPlayerRef.current;
    if (!mediaElement) return;

    if (isPlayingSync) {
      mediaElement.pause();
      recognitionRef.current.stop();
      setIsPlayingSync(false);
    } else {
      mediaElement.play();
      try {
        recognitionRef.current.start();
      } catch {}
      setIsPlayingSync(true);

      mediaElement.onended = () => {
        setIsPlayingSync(false);
        try {
          recognitionRef.current.stop();
        } catch {}
      };
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz direto. Recomendamos o Google Chrome ou Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscriptAudio("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Divide o texto estruturadamente nos 4 pilares fundamentais da VSL
  const structureTranscript = (text: string, videoTitle?: string) => {
    if (!text || text.trim().length === 0) return;

    const words = text.trim().split(/\s+/);
    const totalWords = words.length;

    let hookWords: string[] = [];
    let storyWords: string[] = [];
    let offerWords: string[] = [];
    let ctaWords: string[] = [];

    if (totalWords < 50) {
      hookWords = words;
    } else {
      const hookEnd = Math.floor(totalWords * 0.15);
      const storyEnd = Math.floor(totalWords * 0.6);
      const offerEnd = Math.floor(totalWords * 0.85);

      hookWords = words.slice(0, hookEnd);
      storyWords = words.slice(hookEnd, storyEnd);
      offerWords = words.slice(storyEnd, offerEnd);
      ctaWords = words.slice(offerEnd);
    }

    setFullTranscript(text.trim());
    setTitle(videoTitle || "VSL Transcrita");
    setPillars({
      hook: hookWords.join(" "),
      storyMechanism: storyWords.join(" "),
      offer: offerWords.join(" "),
      cta: ctaWords.join(" "),
    });
  };

  const handleTranscribeYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/transcribe-vsl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Não foi possível extrair a transcrição do vídeo.");
      }

      structureTranscript(data.transcript, data.title);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao conectar com serviço de transcrição.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessRawText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    structureTranscript(rawText, "Roteiro VSL");
  };

  const handleApplyAudioTranscript = () => {
    if (!transcriptAudio.trim()) return;
    structureTranscript(transcriptAudio, title || selectedFile?.name || "Gravação de Áudio");
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadTextFile = () => {
    if (!fullTranscript) return;
    const content = `=== TRANSCRIÇÃO VSL: ${title} ===\n\n` +
      `[1. GANCHO INICIAL]\n${pillars?.hook || ""}\n\n` +
      `[2. HISTÓRIA & MECANISMO ÚNICO]\n${pillars?.storyMechanism || ""}\n\n` +
      `[3. A OFERTA]\n${pillars?.offer || ""}\n\n` +
      `[4. CHAMADA PARA AÇÃO & FECHAMENTO]\n${pillars?.cta || ""}\n\n` +
      `=== TRANSCRIÇÃO COMPLETA ===\n${fullTranscript}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `vsl-transcricao-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalWords = fullTranscript ? fullTranscript.split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadingMinutes = Math.max(1, Math.round(totalWords / 145));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Transcritor de VSL & Anúncios</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Vídeos da Galeria & Arquivos
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Suba vídeos da sua <strong>Galeria de Fotos/Vídeos</strong> ou arquivos do computador (.mp4, .mov, .webm),
            selecione criativos salvos no <strong>Cofre</strong> ou importe do YouTube para dissecar nos 4 pilares de conversão.
          </p>
        </div>
      </div>

      {/* Input Selection Tabs */}
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Selecione o Método de Entrada</CardTitle>
          <CardDescription>
            Escolha um vídeo da sua galeria, do cofre de ofertas, link do YouTube ou gravação direta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl bg-muted/60">
              <TabsTrigger value="gallery" className="gap-1.5 text-xs sm:text-sm font-medium">
                <Film className="h-4 w-4 text-emerald-400" />
                Galeria / Arquivo Local
              </TabsTrigger>
              <TabsTrigger value="vault" className="gap-1.5 text-xs sm:text-sm font-medium">
                <Layers className="h-4 w-4 text-purple-400" />
                Galeria do Cofre ({vaultVideos.length})
              </TabsTrigger>
              <TabsTrigger value="youtube" className="gap-1.5 text-xs sm:text-sm">
                <Video className="h-4 w-4 text-red-500" />
                Link YouTube
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-1.5 text-xs sm:text-sm">
                <Mic className="h-4 w-4 text-blue-500" />
                Gravar / Ditado
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Galeria do Dispositivo / Upload de Vídeo */}
            <TabsContent value="gallery" className="space-y-5 pt-2">
              {!filePreviewUrl ? (
                <div className="p-8 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/50 transition-all bg-muted/10 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Film className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-base">Subir Vídeo da Galeria ou Computador</h4>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Acesse a galeria de vídeos do seu celular ou arquivos do PC (.mp4, .mov, .webm, .mkv, .avi, .mp3).
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <label
                      htmlFor="vsl-gallery-upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm cursor-pointer shadow-md transition-all"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Abrir Galeria / Escolher Vídeo
                    </label>
                    <input
                      id="vsl-gallery-upload"
                      type="file"
                      accept="video/*,audio/*,.mp4,.mov,.webm,.mkv,.avi,.mp3,.wav,.m4a"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {vaultVideos.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("vault")}
                        className="gap-2 text-xs h-10 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Layers className="h-4 w-4 text-purple-400" />
                        Ver Vídeos do Cofre ({vaultVideos.length})
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Informações do Arquivo Selecionado */}
                  <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        {isVideoFile ? <FileVideo className="h-6 w-6" /> : <FileAudio className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{title || selectedFile?.name || "Vídeo Selecionado"}</h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          {selectedFile ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}` : "Vídeo Carregado da Galeria"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="vsl-gallery-replace"
                        className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer px-2 py-1"
                      >
                        Trocar vídeo da galeria
                      </label>
                      <input
                        id="vsl-gallery-replace"
                        type="file"
                        accept="video/*,audio/*,.mp4,.mov,.webm,.mkv,.avi,.mp3,.wav,.m4a"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Player de Prévia */}
                  <div className="rounded-xl overflow-hidden border border-border bg-black/90 flex justify-center max-h-[360px]">
                    {isVideoFile ? (
                      <video
                        ref={videoPlayerRef}
                        controls
                        src={filePreviewUrl}
                        className="max-h-[360px] w-auto rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="p-6 w-full flex items-center justify-center">
                        <audio ref={audioPlayerRef} controls src={filePreviewUrl} className="w-full max-w-lg" />
                      </div>
                    )}
                  </div>

                  {/* Ações de Transcrição */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Opção 1: Reconhecimento de Voz ao Vivo (Gratuito) */}
                    <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-sm">Opção 1: Reprodução com Voz</h5>
                          <Badge variant="outline" className="text-[10px] text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                            100% Gratuito
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          O navegador reproduz o áudio do vídeo e transcreve a fala em tempo real via microfone ou som do sistema.
                        </p>
                      </div>

                      <Button
                        onClick={togglePlaySync}
                        variant={isPlayingSync ? "destructive" : "default"}
                        className="w-full gap-2 font-semibold shadow-sm"
                      >
                        {isPlayingSync ? (
                          <>
                            <Pause className="h-4 w-4" /> Pausar Transcrição do Vídeo
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" /> Iniciar Reprodução & Transcrição
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Opção 2: Transcrição em Segundo Plano com IA (Whisper) */}
                    <div className="p-5 rounded-xl border border-border bg-card/60 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-sm">Opção 2: IA Whisper</h5>
                            <Badge variant="outline" className="text-[10px] text-blue-400 bg-blue-500/10 border-blue-500/30">
                              Automático
                            </Badge>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowKeyInput(!showKeyInput)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Key className="h-3 w-3" />
                            {openAiKey ? "Chave salva" : "Configurar API Key"}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Processamento rápido direto do arquivo sem precisar reproduzi-lo na caixa de som.
                        </p>
                      </div>

                      {showKeyInput && (
                        <div className="space-y-1">
                          <Input
                            placeholder="sk-... (Chave OpenAI Whisper)"
                            type="password"
                            value={openAiKey}
                            onChange={(e) => handleOpenAiKeyChange(e.target.value)}
                            className="h-8 text-xs font-mono"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            Sua chave fica salva apenas no seu navegador para uso contínuo.
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={handleTranscribeWithWhisper}
                        disabled={isTranscribingFile}
                        className="w-full gap-2 font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                      >
                        {isTranscribingFile ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Processando com Whisper...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" /> Transcrever com IA Whisper
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Texto Transcrito em Tempo Real */}
                  {transcriptAudio && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Texto Capturado do Vídeo:
                        </span>
                        <Button
                          size="sm"
                          onClick={handleApplyAudioTranscript}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          Estruturar nos 4 Pilares
                        </Button>
                      </div>
                      <p className="text-xs font-mono text-foreground leading-relaxed max-h-40 overflow-auto">
                        {transcriptAudio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Galeria de Vídeos do Cofre */}
            <TabsContent value="vault" className="space-y-4 pt-2">
              <div>
                <h4 className="text-sm font-semibold mb-1">Vídeos Salvos no seu Cofre de Ofertas</h4>
                <p className="text-xs text-muted-foreground">
                  Selecione qualquer criativo ou VSL que você salvou pelo FluxoMiner para transcrever e dissecar imediatamente.
                </p>
              </div>

              {isLoadingVault ? (
                <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando galeria do cofre...
                </div>
              ) : vaultVideos.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2">
                  <Layers className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">Nenhum vídeo salvo no Cofre ainda</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Quando você minerar anúncios em vídeo com a extensão FluxoMiner, eles aparecerão automaticamente aqui.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/tools/swipe-file")}
                    className="text-xs mt-2"
                  >
                    Acessar Cofre de Ofertas
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {vaultVideos.map((ad) => (
                    <div
                      key={ad.id}
                      onClick={() => handleSelectFromVault(ad)}
                      className="group p-3 rounded-xl border border-border bg-card hover:border-purple-500/50 hover:bg-muted/10 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/60">
                        {ad.thumbnailUrl ? (
                          <img
                            src={ad.thumbnailUrl}
                            alt={ad.advertiserName}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            <Play className="h-8 w-8" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white uppercase">
                          {ad.creativeType || "Vídeo"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-semibold text-xs line-clamp-1 group-hover:text-purple-400 transition">
                          {ad.advertiserName}
                        </h5>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {ad.copy || "Sem copy descrita"}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium"
                      >
                        Transcrever Este Vídeo
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab 3: YouTube */}
            <TabsContent value="youtube" className="space-y-4 pt-2">
              <form onSubmit={handleTranscribeYouTube} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="https://www.youtube.com/watch?v=... ou youtu.be/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="flex-1 h-12 text-base"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !youtubeUrl.trim()}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Extraindo Legendas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Transcrever VSL
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Funciona com qualquer vídeo público ou não listado que possua legendas ou áudio detectável.
              </p>
            </TabsContent>

            {/* Tab 4: Audio Recording */}
            <TabsContent value="audio" className="space-y-4 pt-2">
              <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {isRecording ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-base">
                    {isRecording ? "Gravando áudio em tempo real..." : "Transcrever por Reconhecimento de Voz"}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Clique no botão abaixo e fale ou toque o áudio da VSL perto do microfone.
                    A transcrição em português será gerada instantaneamente.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    className="gap-2 font-semibold"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? "Parar Gravação" : "Começar a Falar / Tocar Áudio"}
                  </Button>

                  {transcriptAudio && !isRecording && (
                    <Button onClick={handleApplyAudioTranscript} variant="secondary" className="gap-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      Estruturar Pilares
                    </Button>
                  )}
                </div>

                {transcriptAudio && (
                  <div className="w-full text-left p-4 rounded-lg bg-card border border-border mt-4 max-h-48 overflow-auto">
                    <p className="text-xs font-mono text-foreground leading-relaxed">{transcriptAudio}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 5: Paste Raw Text */}
            <TabsContent value="paste" className="space-y-4 pt-2">
              <form onSubmit={handleProcessRawText} className="space-y-3">
                <Textarea
                  placeholder="Cole aqui o texto ou roteiro bruto copiado de outra ferramenta (CapCut, Descript, Otter, Whisper ou bloco de notas)..."
                  value={rawText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRawText(e.target.value)}
                  className="min-h-[160px] font-mono text-sm leading-relaxed"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!rawText.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Organizar nos 4 Pilares de VSL
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Structured Results */}
      {pillars && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Metrics bar */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="text-xs text-muted-foreground">Roteiro dissecado em blocos lógicos de conversão.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1 font-mono text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  {totalWords} palavras
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  ~{estimatedReadingMinutes} min de fala
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadTextFile}
                  className="h-8 gap-1.5 text-xs ml-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Baixar Roteiro (.txt)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(fullTranscript, "full")}
                  className="h-8 gap-1.5 text-xs"
                >
                  {copiedKey === "full" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "full" ? "Copiado!" : "Copiar Tudo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pillars Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pillar 1: Hook */}
            <Card className="border-border hover:border-red-500/50 transition-all bg-card shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-red-500/10 text-red-400">
                      <Flame className="h-4 w-4" />
                    </span>
                    <CardTitle className="text-base">1. O Gancho (Hook)</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Primeiros 15-30 segundos para prender a atenção e quebrar o padrão.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(pillars.hook, "hook")}
                  className="h-8 px-2 text-xs"
                >
                  {copiedKey === "hook" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed max-h-48 overflow-auto border border-border/50">
                  {pillars.hook || "Nenhum gancho específico identificado."}
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Story & Unique Mechanism */}
            <Card className="border-border hover:border-blue-500/50 transition-all bg-card shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <CardTitle className="text-base">2. História & Mecanismo Único</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    A dor oculta, a jornada de descoberta e o segredo por trás do método.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(pillars.storyMechanism, "story")}
                  className="h-8 px-2 text-xs"
                >
                  {copiedKey === "story" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed max-h-48 overflow-auto border border-border/50">
                  {pillars.storyMechanism || "Nenhuma história específica identificada."}
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: The Irresistible Offer */}
            <Card className="border-border hover:border-emerald-500/50 transition-all bg-card shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <CardTitle className="text-base">3. A Oferta Irresistível</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    O produto, empilhamento de valor, bônus e entregáveis imediatos.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(pillars.offer, "offer")}
                  className="h-8 px-2 text-xs"
                >
                  {copiedKey === "offer" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed max-h-48 overflow-auto border border-border/50">
                  {pillars.offer || "Nenhum detalhe de oferta identificado."}
                </div>
              </CardContent>
            </Card>

            {/* Pillar 4: Call to Action & Guarantee */}
            <Card className="border-border hover:border-amber-500/50 transition-all bg-card shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                      <Send className="h-4 w-4" />
                    </span>
                    <CardTitle className="text-base">4. CTA, Garantia & Fechamento</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Urgência, escassez, eliminação de risco e chamada imperativa para compra.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(pillars.cta, "cta")}
                  className="h-8 px-2 text-xs"
                >
                  {copiedKey === "cta" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed max-h-48 overflow-auto border border-border/50">
                  {pillars.cta || "Nenhum fechamento específico identificado."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Synergy action */}
          <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Deseja modelar esta VSL e criar suas próprias variações?
              </h4>
              <p className="text-xs text-muted-foreground">
                Copie o mecanismo e os ganchos identificados acima e acesse o Gerador de Copy para gerar headlines, scripts e e-mails originais.
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/tools/copy-generator")}
              className="gap-2 shrink-0 bg-primary hover:bg-primary/90"
            >
              Ir para Gerador de Copy
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
