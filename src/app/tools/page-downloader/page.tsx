"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PageDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/download-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Falha ao baixar");

      const data = await res.json();
      if (data.success) {
        // Criar um blob e baixar o arquivo HTML
        const blob = new Blob([data.html], { type: "text/html" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `pagina-clonada-${new Date().getTime()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Baixador de Páginas</h1>
        <p className="text-muted-foreground mt-2">
          Clone páginas de vendas para modelagem. Cole a URL abaixo e faremos o download do HTML, CSS e Imagens.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Clonagem</CardTitle>
          <CardDescription>
            Insira o link da página do concorrente. Removemos automaticamente scripts de rastreamento (Pixel, Analytics).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDownload} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input 
                placeholder="https://exemplo.com/pagina-de-vendas" 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Baixar Página
              </Button>
            </div>
          </form>

          {status === "success" && (
            <Alert className="mt-6 border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 stroke-current" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>
                A página foi clonada e está disponível no seu Cofre de Ofertas ou pronta para download em .zip.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível clonar esta página. Verifique se a URL está correta ou se a página bloqueia acessos automatizados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
