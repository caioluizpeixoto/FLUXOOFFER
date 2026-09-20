"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  Eye,
  Code2,
  Smartphone,
  Monitor,
  Sparkles,
  FileCheck,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DownloadResult {
  success: boolean;
  url: string;
  title: string;
  html: string;
  sizeBytes: number;
  imagesCount: number;
  videoLinks: string[];
}

export default function PageDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState("preview");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch("/api/download-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao baixar a página");
      }

      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro desconhecido ao baixar página.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHtmlFile = () => {
    if (!result) return;
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const sanitizedTitle = (result.title || "pagina-clonada")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 35);
    a.href = downloadUrl;
    a.download = `${sanitizedTitle}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleOpenInNewTab = () => {
    if (!result) return;
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const handleCopyCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Falha ao copiar:", e);
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Baixador & Clonador de Páginas</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Pronto para Uso
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Clone páginas de vendas e advertoriais para modelagem. Removemos automaticamente pixels de rastreamento
            (Facebook, TikTok, GTM) mantendo players de vídeo (VTurb, Panda) e estrutura intactos.
          </p>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Insira o Link da Página</CardTitle>
          <CardDescription>
            Cole o link direto da landing page, VSL ou presell do concorrente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDownload} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="ex: https://oferta-concorrente.com/vsl ou exemplo.com/pagina"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
              className="flex-1 bg-background text-base h-12"
            />
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="h-12 px-6 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando HTML...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Clonar Página
                </>
              )}
            </Button>
          </form>

          {/* Quick tips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
            <span className="font-medium text-foreground">Dica:</span>
            <span>Aceita páginas completas de VSL, Webflow, Elementor, Shopify e Hotmart.</span>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao Clonar</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Metadata bar */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base line-clamp-1">{result.title}</h3>
                  <p className="text-xs text-muted-foreground truncate max-w-lg">{result.url}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1 font-mono text-xs">
                  <FileCheck className="h-3.5 w-3.5" />
                  {formatFileSize(result.sizeBytes)}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {result.imagesCount} imagens
                </Badge>
                {result.videoLinks.length > 0 && (
                  <Badge variant="secondary" className="gap-1 text-xs text-amber-400 bg-amber-400/10">
                    <Video className="h-3.5 w-3.5" />
                    {result.videoLinks.length} player(s) de VSL
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-card border border-border">
                  <TabsTrigger value="preview" className="gap-1.5 text-xs sm:text-sm">
                    <Eye className="h-4 w-4" />
                    Prévia Visual
                  </TabsTrigger>
                  <TabsTrigger value="code" className="gap-1.5 text-xs sm:text-sm">
                    <Code2 className="h-4 w-4" />
                    Código Fonte
                  </TabsTrigger>
                  <TabsTrigger value="media" className="gap-1.5 text-xs sm:text-sm">
                    <Video className="h-4 w-4" />
                    Mídias Detectadas ({result.videoLinks.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === "preview" && (
                <div className="hidden sm:flex items-center gap-1 bg-card border border-border p-1 rounded-lg">
                  <Button
                    size="sm"
                    variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                    className="h-7 px-2.5 text-xs gap-1"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                  </Button>
                  <Button
                    size="sm"
                    variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                    className="h-7 px-2.5 text-xs gap-1"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab} className="h-9 gap-1.5 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir em Nova Aba
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyCode} className="h-9 gap-1.5 text-xs">
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Copiar HTML"}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveHtmlFile}
                className="h-9 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                Baixar Arquivo .html
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl min-h-[500px]">
            {activeTab === "preview" && (
              <div className="flex justify-center bg-muted/30 p-4 min-h-[600px]">
                <div
                  className={`transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden border border-border ${
                    previewDevice === "mobile" ? "w-[390px] h-[780px]" : "w-full h-[750px]"
                  }`}
                >
                  <iframe
                    title="Prévia da Página Clonada"
                    srcDoc={result.html}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="p-4 bg-muted/40 font-mono text-xs max-h-[650px] overflow-auto">
                <pre className="text-foreground/90 whitespace-pre-wrap break-all select-all">
                  {result.html}
                </pre>
              </div>
            )}

            {activeTab === "media" && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4 text-emerald-400" />
                    Players de Vídeo Detectados ({result.videoLinks.length})
                  </h4>
                  {result.videoLinks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum player de vídeo externo identificado diretamente na estrutura.</p>
                  ) : (
                    <div className="space-y-2">
                      {result.videoLinks.map((vUrl, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background text-xs">
                          <span className="font-mono truncate max-w-lg">{vUrl}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => window.open(vUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Acessar Player
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Como Utilizar Esta Página
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    1. Clique em <strong>Baixar Arquivo .html</strong> para salvar o código limpo no seu computador.<br />
                    2. Você pode abrir o arquivo diretamente no VS Code, WordPress/Elementor (via importação de template) ou hospedá-lo em qualquer servidor CDN/Vercel/Cloudflare Pages.<br />
                    3. Lembre-se de substituir os links de checkout dos botões pelo seu link próprio!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
