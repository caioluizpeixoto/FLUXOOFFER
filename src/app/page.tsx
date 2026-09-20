import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Video, Layers, FileText, Quote } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao FluxoOffer</h1>
        <p className="text-muted-foreground mt-2">
          Sua central de controle para criar, validar e escalar ofertas low-ticket.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <Download className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Baixador de Páginas</CardTitle>
            <CardDescription>Clone páginas de vendas dos concorrentes para modelagem rápida.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Último uso: Há 2 dias</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <Video className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Transcritor VSL</CardTitle>
            <CardDescription>Extraia o roteiro completo de qualquer vídeo de vendas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">VSLs transcritas: 14</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <Quote className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>Gerador de Depoimentos</CardTitle>
            <CardDescription>Crie mockups realistas de WhatsApp e Instagram.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Pronto para uso</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <FileText className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle>Gerador de Copy</CardTitle>
            <CardDescription>Crie headlines e estruturas com ajuda de IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <Layers className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Cofre de Ofertas</CardTitle>
            <CardDescription>Seu swipe file pessoal de anúncios e landing pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Itens salvos: 42</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
