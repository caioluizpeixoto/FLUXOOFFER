"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Video,
  Layers,
  FileText,
  Quote,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ToolCardInfo {
  title: string;
  description: string;
  url: string;
  icon: any;
  color: string;
  badge: string;
  badgeColor: string;
  realStat: string;
}

export default function Home() {
  const [savedOffersCount, setSavedOffersCount] = useState<number | null>(null);

  useEffect(() => {
    // Busca contagem real de ofertas salvas no Cofre
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedOffersCount(data.length);
        } else {
          setSavedOffersCount(0);
        }
      })
      .catch(() => setSavedOffersCount(0));
  }, []);

  const tools: ToolCardInfo[] = [
    {
      title: "Page Builder Low-Ticket",
      description: "Crie e faça deploy de landing pages agressivas com VSL, lógica de upsell e tracking em 1 clique.",
      url: "/tools/page-builder",
      icon: Flame,
      color: "text-red-500",
      badge: "Alta Conversão",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/40 font-bold",
      realStat: "VSL + Upsell + Deploy Vercel",
    },
    {
      title: "Baixador de Páginas",
      description: "Clone páginas de vendas e advertoriais limpos de pixels de rastreamento com visual preservado.",
      url: "/tools/page-downloader",
      icon: Download,
      color: "text-emerald-500",
      badge: "100% Funcional",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      realStat: "Limpeza de pixels & Preservação de VSL",
    },
    {
      title: "Transcritor de VSL",
      description: "Extraia roteiros do YouTube, dite com microfone e divida automaticamente nos 4 pilares de conversão.",
      url: "/tools/vsl-transcriber",
      icon: Video,
      color: "text-blue-500",
      badge: "Novo",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      realStat: "Gancho, História, Mecanismo e CTA",
    },
    {
      title: "Cofre de Ofertas",
      description: "Seu swipe file pessoal de criativos e anúncios minerados com métricas e dias de escala.",
      url: "/tools/swipe-file",
      icon: Layers,
      color: "text-purple-500",
      badge: "Integrado ao FluxoMiner",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      realStat:
        savedOffersCount !== null
          ? `${savedOffersCount} ${savedOffersCount === 1 ? "oferta salva real" : "ofertas salvas reais"}`
          : "Carregando ofertas...",
    },
    {
      title: "Gerador de Copy",
      description: "Crie 10 headlines matadoras, ganchos de 3s, estruturas AIDA, PAS e roteiros de VSL prontos.",
      url: "/tools/copy-generator",
      icon: FileText,
      color: "text-orange-500",
      badge: "Novo",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      realStat: "Modelos validados de resposta direta",
    },
    {
      title: "Gerador de Depoimentos",
      description: "Crie prints e provas sociais realistas de WhatsApp, Instagram Direct e comentários de TikTok.",
      url: "/tools/testimonial-generator",
      icon: Quote,
      color: "text-green-500",
      badge: "Exportação HD",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/30",
      realStat: "Mockups fiéis aos apps reais",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-card via-card to-primary/10 border border-border shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-medium">
              Central do Produtor
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Dados 100% Reais
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao FluxoOffer</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sua central de controle para criar, minerar e modelar ofertas de alta conversão.
            Todas as ferramentas estão ativas e integradas diretamente à sua extensão <strong>FluxoMiner</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/tools/swipe-file">
            <Card className="p-3 px-5 border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Cofre de Ofertas</div>
                  <div className="text-base font-bold">
                    {savedOffersCount !== null ? savedOffersCount : "..."} Itens Reais
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Grid de Ferramentas Funcionais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Suíte de Ferramentas
          </h2>
          <span className="text-xs text-muted-foreground">Clique em qualquer ferramenta para começar</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.url} href={tool.url} className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-200 cursor-pointer border-border group-hover:border-primary/50 bg-card hover:bg-gradient-to-br hover:from-card hover:to-primary/5 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-muted/60 ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-medium ${tool.badgeColor}`}>
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{tool.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono text-[11px] truncate max-w-[220px]">{tool.realStat}</span>
                    <span className="text-primary font-medium group-hover:underline">Acessar</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Informações da Integração FluxoMiner */}
      <Card className="border-border bg-card/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-base">Integração Exclusiva FluxoMiner</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Como funciona a busca exclusiva do concorrente na Biblioteca de Anúncios da Meta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            • <strong>Filtro Exclusivo por Página:</strong> Ao clicar no botão <em>"🎯 Anúncios Desta Página"</em> dentro de qualquer anúncio ou na página do concorrente no Facebook, o FluxoMiner utiliza o identificador único (<code className="text-foreground">view_all_page_id</code>) da Meta.
          </p>
          <p>
            • <strong>Zero Ruído de Concorrentes Misturados:</strong> Diferente da pesquisa por nome comum (que mistura dezenas de páginas com palavras parecidas), o filtro por ID garante que 100% dos criativos exibidos na tela pertencem estritamente àquela página.
          </p>
          <p>
            • <strong>Sincronização com o Cofre:</strong> Qualquer criativo salvo pela extensão é enviado diretamente para o seu Cofre de Ofertas em tempo real.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
