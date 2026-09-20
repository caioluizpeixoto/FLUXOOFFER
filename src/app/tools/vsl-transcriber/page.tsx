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

export default function VslTranscriber() {
  const [activeTab, setActiveTab] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Áudio ao vivo via Web Speech API
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptAudio, setTranscriptAudio] = useState("");
  const recognitionRef = useRef<any>(null);

  // Resultado da transcrição
  const [title, setTitle] = useState<string>("");
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [pillars, setPillars] = useState<StructuredPillars | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Configura Web Speech API para gravação de áudio
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
          setTranscriptAudio(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

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
      // Proporções clássicas de VSL de alta conversão:
      // Hook: primeiros ~15%
      // História & Mecanismo: ~15% a 60%
      // Oferta: ~60% a 85%
      // CTA & Garantia: ~85% a 100%
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
    structureTranscript(transcriptAudio, "Gravação de Áudio");
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

  // Métricas
  const totalWords = fullTranscript ? fullTranscript.split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadingMinutes = Math.max(1, Math.round(totalWords / 145)); // ~145 palavras/min ritmo de fala

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Transcritor de VSL & Anúncios</h1>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              Pilares Automáticos
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Extraia roteiros completos de vídeos de vendas, grave áudios ao vivo ou insira textos brutos.
            O sistema divide automaticamente a VSL em Gancho, História, Mecanismo Único e Oferta.
          </p>
        </div>
      </div>

      {/* Input Selection Tabs */}
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Selecione o Método de Entrada</CardTitle>
          <CardDescription>
            Escolha como deseja carregar ou transcrever o roteiro do vídeo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 max-w-md bg-muted/60">
              <TabsTrigger value="youtube" className="gap-1.5 text-xs sm:text-sm">
                <Video className="h-4 w-4 text-red-500" />
                Link YouTube
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-1.5 text-xs sm:text-sm">
                <Mic className="h-4 w-4 text-emerald-500" />
                Gravar Áudio
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-1.5 text-xs sm:text-sm">
                <FileText className="h-4 w-4 text-orange-500" />
                Colar Roteiro
              </TabsTrigger>
            </TabsList>

            {/* YouTube Tab */}
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

            {/* Audio Recording Tab */}
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

            {/* Paste Raw Text Tab */}
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
              <AlertTitle>Não foi possível transcrever</AlertTitle>
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
