"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  Copy,
  CheckCircle2,
  Download,
  Flame,
  Zap,
  Target,
  Video,
  Mail,
  RefreshCw,
  Sliders,
  Share2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CopyBrief {
  productName: string;
  niche: string;
  avatar: string;
  mainPain: string;
  bigPromise: string;
  uniqueMechanism: string;
  price: string;
  tone: string;
}

export default function CopyGenerator() {
  const [brief, setBrief] = useState<CopyBrief>({
    productName: "",
    niche: "Saúde & Emagrecimento",
    avatar: "",
    mainPain: "",
    bigPromise: "",
    uniqueMechanism: "",
    price: "R$ 47",
    tone: "Agressivo / Resposta Direta",
  });

  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("headlines");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const fillExample = (type: "saude" | "renda") => {
    if (type === "saude") {
      setBrief({
        productName: "Protocolo Desinchar 21D",
        niche: "Saúde & Emagrecimento",
        avatar: "Mulheres de 30 a 55 anos que já tentaram dietas restritivas e sofrem com efeito sanfona",
        mainPain: "Inchaço abdominal constante, cansaço ao acordar e sensação de que nada que come faz emagrecer",
        bigPromise: "Eliminar até 6kg de retenção e destravar o metabolismo em 21 dias com um chá de 3 ingredientes",
        uniqueMechanism: "O Mecanismo da Reset Metabólico Noturno",
        price: "R$ 47",
        tone: "Curioso / Quebra de Padrão",
      });
    } else {
      setBrief({
        productName: "Mestre da Mineração Meta",
        niche: "Finanças & Renda Extra",
        avatar: "Iniciantes no tráfego pago ou afiliados sem verba para ferramentas caras",
        mainPain: "Gasta dinheiro em testes de anúncios e não acha ofertas validadas que vendem todos os dias",
        bigPromise: "Descubra anúncios validados de 6 dígitos em menos de 10 minutos sem pagar softwares caros",
        uniqueMechanism: "O Filtro Oculto da Biblioteca de Anúncios",
        price: "R$ 97",
        tone: "Agressivo / Resposta Direta",
      });
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.productName || !brief.bigPromise) return;
    setHasGenerated(true);
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Modelos dinâmicos baseados no briefing real fornecido
  const pName = brief.productName || "Seu Produto";
  const pPromise = brief.bigPromise || "alcançar o resultado desejado";
  const pPain = brief.mainPain || "sofrer com esse problema diariamente";
  const pMechanism = brief.uniqueMechanism || "nosso método exclusivo";
  const pAvatar = brief.avatar || "você";
  const pPrice = brief.price || "R$ 47";

  const headlines = [
    {
      type: "Promessa Direta & Prazo",
      text: `Como ${pPromise} sem precisar passar por ${pPain}.`,
    },
    {
      type: "Curiosidade Extrema",
      text: `O segredo de ${pMechanism} que poucas pessoas revelam para finalmente ${pPromise}.`,
    },
    {
      type: "Quebra de Inimigo Comum",
      text: `Por que tudo o que te ensinaram sobre ${pPain} está errado — e como ${pMechanism} resolve isso de vez.`,
    },
    {
      type: "Antes vs Depois",
      text: `De exausto com ${pPain} para o alívio total: conheça o método para ${pPromise}.`,
    },
    {
      type: "Alerta Crítico / Pare de Fazer",
      text: `Pare de tentar resolver ${pPain} da forma tradicional antes de conhecer ${pMechanism}.`,
    },
    {
      type: "Mecanismo Revelado",
      text: `Cientistas explicam: o poder oculto de ${pMechanism} para destravar seus resultados em tempo recorde.`,
    },
    {
      type: "Sem o Maior Sacrifício",
      text: `Descubra a fórmula simples para ${pPromise} sem dietas malucas ou rotinas cansativas.`,
    },
    {
      type: "Desafio dos Primeiros Dias",
      text: `Faça o teste por 7 dias: experimente ${pMechanism} e veja a transformação acontecer diante dos seus olhos.`,
    },
    {
      type: "Garantia de Resultado",
      text: `Ou você consegue ${pPromise} nos próximos dias, ou não paga absolutamente nada por isso.`,
    },
    {
      type: "Atalho Direto",
      text: `O passo a passo de apenas 5 minutos diários com ${pName} para nunca mais sofrer com ${pPain}.`,
    },
  ];

  const threeSecondHooks = [
    {
      title: "Gancho Visual com Pergunta Chocante",
      direction: "[Aponte diretamente para a câmera segurando um objeto inusitado ou com expressão de espanto]",
      script: `Se você ainda sofre com ${pPain}, você precisa parar o que está fazendo agora e ver isso!`,
    },
    {
      title: "Gancho do 'Eles não querem que você saiba'",
      direction: "[Tom de segredo e sussurro nos 2 primeiros segundos aproximando a câmera]",
      script: `A indústria não quer que você descubra ${pMechanism}. Mas hoje eu vou te mostrar exatamente o que funciona.`,
    },
    {
      title: "Gancho de Desafio de Atenção",
      direction: "[Texto em caixa alta piscando na tela: NÃO PULE ESTE VÍDEO]",
      script: `Me dê apenas 30 segundos e eu vou te provar como é possível ${pPromise} ainda esta semana!`,
    },
    {
      title: "Gancho de Contradição / Quebra de Padrão",
      direction: "[Mostre um resultado chocante ou gráfico na tela]",
      script: `Todo mundo acha que para resolver ${pPain} precisa sofrer. Eu fiz o oposto usando ${pMechanism} e olha o que aconteceu...`,
    },
  ];

  const copyAida = `[ATENÇÃO]
Você sabia que a verdadeira causa de ${pPain} não tem nada a ver com falta de força de vontade?

[INTERESSE]
A verdade é que a maioria das soluções tradicionais ignora um fator crucial: ${pMechanism}. Quando você ativa essa chave simples no seu dia a dia, todo o esforço inútil é eliminado.

[DESEJO]
Imagine acordar daqui a alguns dias, olhar no espelho e ver que você conseguiu ${pPromise}. Sem sofrimento, sem frustração e com total clareza do que fazer. É exatamente isso que centenas de pessoas já estão vivenciando.

[AÇÃO]
Clique no botão 'Saiba Mais' abaixo agora mesmo e tenha acesso imediato ao ${pName} por apenas ${pPrice}. Essa condição especial não ficará disponível por muito tempo!`;

  const copyPas = `[PROBLEMA]
Até quando você vai continuar convivendo com ${pPain}? Você sabe o quanto isso drena sua energia, rouba sua paz e te impede de viver com leveza.

[AGITAÇÃO]
O pior de tudo é fingir que está tudo bem enquanto o problema só cresce. Cada dia sem agir é mais um dia perdido se sentindo frustrado e preso no mesmo lugar, vendo outras pessoas conseguirem resultados enquanto você fica para trás.

[SOLUÇÃO]
Existe uma saída rápida e definitiva. O ${pName} foi criado especificamente para eliminar ${pPain} através de ${pMechanism}. Você vai finalmente ${pPromise}, de forma segura e comprovada. Toque no link abaixo antes que o valor promocional de ${pPrice} encerre!`;

  const vslScript = `=== ROTEIRO VSL DE ALTA CONVERSÃO: ${pName} ===

[SLIDE 1 - 3: O GANCHO DE RETENÇÃO]
ÁUDIO: "Se você tem lutado contra ${pPain} e sente que nada do que faz traz resultados reais, preste muita atenção nesta breve apresentação. Nos próximos minutos, vou te revelar ${pMechanism} — uma descoberta simples que está permitindo a pessoas comuns finalmente ${pPromise}."

[SLIDE 4 - 7: A AGITAÇÃO DA DOR & IDENTIFICAÇÃO]
ÁUDIO: "Eu sei exatamente como é se sentir frustrado. Tentar de tudo, gastar tempo e dinheiro com soluções milagrosas que prometem mundos e fundos, para no final voltar à estaca zero. A culpa não é sua. O mercado tradicional te ensina a atacar os sintomas, nunca a causa raiz."

[SLIDE 8 - 12: A REVELAÇÃO DO MECANISMO ÚNICO]
ÁUDIO: "A verdadeira chave para a virada é o que chamamos de ${pMechanism}. Diferente de tudo o que você já viu, esse método atua diretamente na raiz do problema, reprogramando seus resultados sem exigir sacrifícios extremos."

[SLIDE 13 - 18: A APRESENTAÇÃO DA OFERTA]
ÁUDIO: "Foi pensando em tornar isso acessível a todos que desenvolvemos o ${pName}. Um programa prático, direto ao ponto, onde você recebe o passo a passo exato para ${pPromise} no menor tempo possível."

[SLIDE 19 - 22: OS BÔNUS EXCLUSIVOS]
ÁUDIO: "E ao garantir sua vaga hoje, você ainda recebe 3 bônus exclusivos:
1. Guia de Ação Rápida em 7 Dias
2. Checklist de Implementação Diária
3. Suporte Dedicado para Dúvidas"

[SLIDE 23 - 25: A GARANTIA BLINDADA (RISCO ZERO)]
ÁUDIO: "Você tem 7 dias inteiros de garantia incondicional. Teste o método, aplique as instruções. Se por qualquer motivo você não amar os resultados, basta um único e-mail e nós devolveremos 100% do seu dinheiro. Sem perguntas."

[SLIDE 26 - 28: A DECISÃO FINAL & CTA]
ÁUDIO: "Neste momento, você tem dois caminhos. O primeiro é fechar este vídeo e continuar lidando com ${pPain}. O segundo é clicar no botão abaixo agora mesmo e garantir o ${pName} por apenas ${pPrice}. Clique agora e comece sua transformação!"`;

  const emailSequence = [
    {
      subject: `A verdade sobre ${pPain} que ninguém te contou`,
      body: `Olá,\n\nSe você já tentou de tudo para resolver ${pPain} e começou a achar que o problema era com você... preciso te contar uma coisa:\n\nA culpa não é sua.\n\nDurante muito tempo, esconderam que o verdadeiro segredo está em ${pMechanism}.\n\nQuando você entende isso, tudo muda: você finalmente consegue ${pPromise} sem sacrifícios desnecessários.\n\nLiberamos uma apresentação completa explicando como isso funciona na prática:\n\n👉 [Clique aqui para assistir antes que saia do ar]\n\nAbraços,\nEquipe ${pName}`,
    },
    {
      subject: `[Apenas hoje] Garanta seu acesso ao ${pName} por ${pPrice}`,
      body: `Oi,\n\nPassando para avisar que a condição especial de lançamento do ${pName} está prestes a encerrar.\n\nPor apenas ${pPrice}, você terá acesso ao passo a passo validado para ${pPromise} usando ${pMechanism}.\n\nAlém disso, você conta com nossa garantia incondicional de 7 dias: se não gostar, devolvemos 100% do valor.\n\n👉 [Clique aqui e garanta sua vaga agora mesmo]\n\nTe vejo do outro lado,\nEquipe ${pName}`,
    },
  ];

  const handleDownloadAll = () => {
    let output = `# PACK COMPLETO DE COPYWRITING: ${pName}\n\n`;
    output += `## BRIEFING DA OFERTA\n`;
    output += `- Produto: ${pName}\n`;
    output += `- Nicho: ${brief.niche}\n`;
    output += `- Dor Principal: ${pPain}\n`;
    output += `- Grande Promessa: ${pPromise}\n`;
    output += `- Mecanismo: ${pMechanism}\n`;
    output += `- Preço: ${pPrice}\n\n`;

    output += `## 1. 10 HEADLINES DE ALTA CONVERSÃO\n`;
    headlines.forEach((h, i) => {
      output += `${i + 1}. [${h.type}] ${h.text}\n`;
    });
    output += `\n`;

    output += `## 2. GANCHOS DE 3 SEGUNDOS (VÍDEO / REELS)\n`;
    threeSecondHooks.forEach((hk, i) => {
      output += `### Gancho ${i + 1}: ${hk.title}\n${hk.direction}\n"${hk.script}"\n\n`;
    });

    output += `## 3. ESTRUTURA AIDA (ANÚNCIO DE FEED)\n${copyAida}\n\n`;
    output += `## 4. ESTRUTURA PAS (TRÁFEGO DIRETO)\n${copyPas}\n\n`;
    output += `## 5. ROTEIRO DE VSL CURTA\n${vslScript}\n\n`;

    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `copy-pack-${pName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Gerador de Copy & Anúncios</h1>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
              Modelos de Conversão
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Crie headlines matadoras, ganchos de 3 segundos para vídeos, estruturas AIDA, PAS, roteiros de VSL
            e sequências de mensagens configuradas especificamente para sua oferta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fillExample("saude")} className="text-xs">
            Exemplo Saúde
          </Button>
          <Button variant="outline" size="sm" onClick={() => fillExample("renda")} className="text-xs">
            Exemplo Finanças
          </Button>
        </div>
      </div>

      {/* Briefing Form */}
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            Briefing da Sua Oferta
          </CardTitle>
          <CardDescription>
            Preencha os dados do seu produto para gerar copies personalizadas com alta persuasão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nome do Produto</label>
                <Input
                  placeholder="ex: Protocolo Sono Blindado"
                  value={brief.productName}
                  onChange={(e) => setBrief({ ...brief, productName: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Nicho da Oferta</label>
                <select
                  value={brief.niche}
                  onChange={(e) => setBrief({ ...brief, niche: e.target.value })}
                  className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="Saúde & Emagrecimento">Saúde & Emagrecimento</option>
                  <option value="Finanças & Renda Extra">Finanças & Renda Extra</option>
                  <option value="Marketing & Negócios">Marketing & Negócios</option>
                  <option value="Beleza & Skincare">Beleza & Skincare</option>
                  <option value="Relacionamento & Conquista">Relacionamento & Conquista</option>
                  <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Preço da Oferta</label>
                <Input
                  placeholder="ex: R$ 47 ou R$ 97"
                  value={brief.price}
                  onChange={(e) => setBrief({ ...brief, price: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">A Maior Dor / Frustração</label>
                <Textarea
                  placeholder="Qual é a dor que tira o sono do seu cliente? ex: Acorda cansado, não consegue emagrecer mesmo com dieta..."
                  value={brief.mainPain}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBrief({ ...brief, mainPain: e.target.value })}
                  className="mt-1 min-h-[75px]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">A Grande Promessa</label>
                <Textarea
                  placeholder="Qual o resultado específico e mensurável que o produto entrega? ex: Desinchar até 5kg em 14 dias..."
                  value={brief.bigPromise}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBrief({ ...brief, bigPromise: e.target.value })}
                  className="mt-1 min-h-[75px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Mecanismo Único (Segredo)</label>
                <Input
                  placeholder="ex: O Ritual da Janela Noturna, O Algoritmo Silencioso..."
                  value={brief.uniqueMechanism}
                  onChange={(e) => setBrief({ ...brief, uniqueMechanism: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">Tom de Voz</label>
                <select
                  value={brief.tone}
                  onChange={(e) => setBrief({ ...brief, tone: e.target.value })}
                  className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="Agressivo / Resposta Direta">Agressivo / Resposta Direta</option>
                  <option value="Curioso / Quebra de Padrão">Curioso / Quebra de Padrão</option>
                  <option value="Científico / Especialista">Científico / Especialista</option>
                  <option value="Emocional / Empático">Emocional / Empático</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="px-8 bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-md">
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Copies & Roteiros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generated Copies Section */}
      {hasGenerated && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Copies Prontas para Validação</h2>
              <p className="text-xs text-muted-foreground">Clique no ícone para copiar qualquer copy instantaneamente.</p>
            </div>

            <Button onClick={handleDownloadAll} variant="outline" size="sm" className="gap-2 text-xs">
              <Download className="h-4 w-4" />
              Baixar Todas (.md)
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-card border border-border flex flex-wrap h-auto p-1 gap-1">
              <TabsTrigger value="headlines" className="gap-1.5 text-xs">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                10 Headlines Matadoras
              </TabsTrigger>
              <TabsTrigger value="hooks" className="gap-1.5 text-xs">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Ganchos de 3s (Vídeos)
              </TabsTrigger>
              <TabsTrigger value="aida" className="gap-1.5 text-xs">
                <Target className="h-3.5 w-3.5 text-blue-400" />
                Estrutura AIDA
              </TabsTrigger>
              <TabsTrigger value="pas" className="gap-1.5 text-xs">
                <Flame className="h-3.5 w-3.5 text-red-400" />
                Estrutura PAS
              </TabsTrigger>
              <TabsTrigger value="vsl" className="gap-1.5 text-xs">
                <Video className="h-3.5 w-3.5 text-emerald-400" />
                Roteiro de VSL Curta
              </TabsTrigger>
              <TabsTrigger value="emails" className="gap-1.5 text-xs">
                <Mail className="h-3.5 w-3.5 text-purple-400" />
                Sequência de E-mails / Whats
              </TabsTrigger>
            </TabsList>

            {/* Headlines */}
            <TabsContent value="headlines" className="space-y-3">
              <div className="grid gap-3">
                {headlines.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-4 hover:border-orange-500/40 transition-all shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.text}</p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyText(item.text, `hl_${idx}`)}
                      className="h-8 w-8 p-0 shrink-0"
                    >
                      {copiedIndex === `hl_${idx}` ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 3s Hooks */}
            <TabsContent value="hooks" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {threeSecondHooks.map((item, idx) => (
                  <Card key={idx} className="border-border bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyText(`${item.direction}\n"${item.script}"`, `hk_${idx}`)}
                        className="h-7 w-7 p-0"
                      >
                        {copiedIndex === `hk_${idx}` ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-muted-foreground italic font-mono bg-muted/30 p-2 rounded">
                        {item.direction}
                      </p>
                      <p className="text-sm font-medium text-foreground">"{item.script}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AIDA */}
            <TabsContent value="aida">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Anúncio Completo com Estrutura AIDA</CardTitle>
                    <CardDescription className="text-xs">
                      Ideal para criativos de Feed, Carrosséis e posts de engajamento no Instagram e Facebook.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(copyAida, "aida")}
                    className="gap-1.5 text-xs"
                  >
                    {copiedIndex === "aida" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === "aida" ? "Copiado!" : "Copiar Copy"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {copyAida}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PAS */}
            <TabsContent value="pas">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Estrutura PAS (Problema, Agitação, Solução)</CardTitle>
                    <CardDescription className="text-xs">
                      Focada em tráfego direto de alta conversão, mexendo na ferida do avatar e ofertando alívio imediato.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(copyPas, "pas")}
                    className="gap-1.5 text-xs"
                  >
                    {copiedIndex === "pas" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === "pas" ? "Copiado!" : "Copiar Copy"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {copyPas}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* VSL Script */}
            <TabsContent value="vsl">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Roteiro Completo de VSL Curta (5-8 min)</CardTitle>
                    <CardDescription className="text-xs">
                      Dissecado por blocos de slides com falas prontas para gravação ou locução com IA.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyText(vslScript, "vsl")}
                    className="gap-1.5 text-xs"
                  >
                    {copiedIndex === "vsl" ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === "vsl" ? "Copiado!" : "Copiar Roteiro"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-auto">
                    {vslScript}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Sequence */}
            <TabsContent value="emails" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {emailSequence.map((email, idx) => (
                  <Card key={idx} className="border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <Badge variant="outline" className="text-[10px]">
                          E-mail / WhatsApp #{idx + 1}
                        </Badge>
                        <CardTitle className="text-xs mt-1 font-semibold">{email.subject}</CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyText(`Assunto: ${email.subject}\n\n${email.body}`, `em_${idx}`)}
                        className="h-7 w-7 p-0"
                      >
                        {copiedIndex === `em_${idx}` ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg bg-muted/40 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-auto">
                        {email.body}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
