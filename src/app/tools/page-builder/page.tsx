"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  LayoutTemplate,
  Type,
  Coins,
  Rocket,
  Monitor,
  Smartphone,
  Upload,
  Play,
  VolumeX,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Copy,
  AlertTriangle,
  Code2,
  Globe,
  Radio,
  Eye,
  RefreshCw,
  Gift,
  HelpCircle,
  User,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  BookOpen,
  Palette,
  Wifi,
  Battery,
  Layers,
} from "lucide-react";

// Tipos estruturados
interface ResourceItem {
  id: string;
  title: string;
  tag: string;
  iconBg: string;
  emoji: string;
  description: string;
}

interface BonusItem {
  id: string;
  title: string;
  originalPrice: string;
  description: string;
  tag: string;
}

interface BenefitItem {
  id: string;
  title: string;
  description: string;
  color: string;
  emoji: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badge?: string;
  mediaType: "mockup" | "vsl";
  badgeHero: string;
  headline: string;
  subheadline: string;
  videoId: string;
  originalPrice: string;
  discountPrice: string;
  ctaText: string;
  guaranteeText: string;
  basicCheckoutUrl: string;
  premiumCheckoutUrl: string;
  upsellCopy: string;
  subdomain: string;
  socialProofText: string;
  benefitsHeadline: string;
  benefitsSubheadline: string;
  resourceHeadline: string;
  bonusHeadline: string;
  basicPlanTitle: string;
  basicPlanPrice: string;
  basicPlanCta: string;
  premiumPlanTitle: string;
  premiumPlanPrice: string;
  premiumPlanCta: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "lowticket-100k",
    name: "Template Validado 100k (Kit Low-Ticket)",
    category: "Mais Lucrativo (Sem VSL)",
    description: "Modelo validado que faturou 100k em nichos de apostilas, atividades, PDFs e e-books. Mockup 3D, carrossel de recursos, 3 passos, bônus liberados e tabela dupla.",
    badge: "🏆 100k Validado",
    mediaType: "mockup",
    badgeHero: "KIT ATIVIDADES DE INGLÊS (+200 FOLHAS)",
    headline: "Suas aulas de inglês nunca mais serão as mesmas com essas +200 Atividades Lúdicas.",
    subheadline: "O material testado e validado em sala de aula para prender a atenção das crianças, acelerar o aprendizado e poupar horas de planejamento.",
    videoId: "",
    originalPrice: "R$ 97,00",
    discountPrice: "R$ 27,90",
    ctaText: "EU QUERO O MATERIAL AGORA",
    guaranteeText: "Garantia Incondicional de 7 Dias",
    basicCheckoutUrl: "https://pay.kiwify.com.br/kit-basico-10",
    premiumCheckoutUrl: "https://pay.kiwify.com.br/kit-completo-27",
    upsellCopy: "ESPERA! Não finalize ainda. Adicione o Pacote de Jogos Extras + Certificados em PDF por apenas mais R$ 14,90 nesta transação única!",
    subdomain: "kit-atividades.fluxooffer.app",
    socialProofText: "⭐⭐⭐⭐⭐ 4.9/5 (+ de 12.400 professoras e mães aprovaram)",
    benefitsHeadline: "Inglês que prende a atenção das crianças",
    benefitsSubheadline: "Desenvolvido por pedagogos com foco em fixação visual e engajamento infantil.",
    resourceHeadline: "Veja alguns dos recursos do kit",
    bonusHeadline: "Presentes Liberados Apenas Hoje!",
    basicPlanTitle: "Coleção Básica",
    basicPlanPrice: "R$ 10,00",
    basicPlanCta: "QUERO O PLANO BÁSICO",
    premiumPlanTitle: "Coleção Completa VIP",
    premiumPlanPrice: "R$ 27,90",
    premiumPlanCta: "QUERO O PACOTE COMPLETO",
    authorName: "Professora Mariana Castro",
    authorRole: "Especialista em Educação Infantil Bilíngue",
    authorBio: "Educadora apaixonada com mais de 10 anos de experiência em sala de aula. Criou este kit para ajudar professores a terem aulas mágicas sem passar a noite inteira planejando.",
  },
  {
    id: "vsl-direta",
    name: "VSL Direta",
    category: "Alta Conversão",
    description: "Vídeo de vendas agressivo com gancho nos primeiros 5s e oferta com quebra de objeções.",
    badge: "Alta Conversão",
    mediaType: "vsl",
    badgeHero: "APRESENTAÇÃO EXCLUSIVA LIBERADA",
    headline: "O Mecanismo Oculto Que Gerou R$ 14.890 em 7 Dias Com Produtos de R$ 19 a R$ 47",
    subheadline: "Sem precisar aparecer na câmera, sem gravar stories e sem gastar fortunas em anúncios caros.",
    videoId: "dQw4w9WgXcQ",
    originalPrice: "R$ 497,00",
    discountPrice: "R$ 27,90",
    ctaText: "QUERO LIBERAR MEU ACESSO COM 94% OFF",
    guaranteeText: "Garantia Blindada de 7 Dias ou Seu Dinheiro 100% de Volta",
    basicCheckoutUrl: "https://pay.kiwify.com.br/vsl-funil-27",
    premiumCheckoutUrl: "https://pay.kiwify.com.br/funil-vip-orderbump-47",
    upsellCopy: "ESPERA! Não finalize ainda. Adicione os 3 Funis Validados de Upsell Imediato que dobram o seu Ticket Médio por míseros R$ 19,90 a mais nesta transação única!",
    subdomain: "vsl-vip.fluxooffer.app",
    socialProofText: "⚡ 54 pessoas assistindo a este vídeo agora",
    benefitsHeadline: "Pilares do Mecanismo de Escala Rápida",
    benefitsSubheadline: "Como estruturar micro-ofertas diárias sem complexidade.",
    resourceHeadline: "O Que Você Recebe Dentro do Acesso VIP",
    bonusHeadline: "Bônus de Ação Rápida Inclusos Hoje",
    basicPlanTitle: "Acesso Essencial",
    basicPlanPrice: "R$ 27,90",
    basicPlanCta: "QUERO COMEÇAR AGORA",
    premiumPlanTitle: "Acelerador VIP Turbo",
    premiumPlanPrice: "R$ 47,80",
    premiumPlanCta: "QUERO O PLANO COMPLETO",
    authorName: "Equipe de Resposta Direta",
    authorRole: "Growth & Funis Low-Ticket",
    authorBio: "Especialistas com mais de 7 dígitos gerados em ofertas diretas no mercado nacional e internacional.",
  },
  {
    id: "ebook-nicho",
    name: "E-book Nicho",
    category: "Infoproduto",
    description: "Layout validado para nichos de saúde, estética, emagrecimento ou renda extra.",
    mediaType: "mockup",
    badgeHero: "GUIA PRÁTICO EM PDF",
    headline: "O Guia Prático de 3 Fórmulas Naturais Que Destravam o Metabolismo Noturno",
    subheadline: "Assista a esta rápida aula explicativa de 3 minutos antes que o link oficial saia do ar.",
    videoId: "907297073",
    originalPrice: "R$ 197,00",
    discountPrice: "R$ 37,90",
    ctaText: "QUERO O GUIA COMPLETO COM 80% DE DESCONTO",
    guaranteeText: "Garantia Incondicional de 7 Dias - Risco Absolutamente Zero",
    basicCheckoutUrl: "https://pay.kiwify.com.br/ebook-emagrece-37",
    premiumCheckoutUrl: "https://pay.kiwify.com.br/combo-turbo-67",
    upsellCopy: "ATENÇÃO! Antes de confirmar seu pagamento, garanta o Cardápio Acelerador de 21 Dias + Suporte VIP no WhatsApp por apenas mais R$ 19,90!",
    subdomain: "protocolo.fluxooffer.app",
    socialProofText: "⭐⭐⭐⭐⭐ 4.8/5 (+ de 3.200 alunas transformadas)",
    benefitsHeadline: "Resultados Visíveis nos Primeiros 7 Dias",
    benefitsSubheadline: "Método 100% natural baseado em alimentos comuns de supermercado.",
    resourceHeadline: "Capítulos e Módulos do Guia",
    bonusHeadline: "Presentes Liberados Hoje",
    basicPlanTitle: "Guia Básico",
    basicPlanPrice: "R$ 19,90",
    basicPlanCta: "QUERO O GUIA BÁSICO",
    premiumPlanTitle: "Combo Completo + Cardápios",
    premiumPlanPrice: "R$ 37,90",
    premiumPlanCta: "QUERO O COMBO COMPLETO",
    authorName: "Dra. Juliana Prado",
    authorRole: "Nutricionista e Pesquisadora",
    authorBio: "Dedicou 8 anos estudando compostos naturais que aceleram a queima lipídica durante o sono.",
  },
  {
    id: "saas-app",
    name: "SaaS/App",
    category: "Tecnologia",
    description: "Página moderna para micro-SaaS, scripts, extensões e robôs de automação lucrativa.",
    mediaType: "vsl",
    badgeHero: "SOFTWARE DE AUTOMAÇÃO 24/7",
    headline: "O Robô Silencioso Que Dispara e Fecha Vendas no WhatsApp no Piloto Automático 24/7",
    subheadline: "Ative em 3 cliques no seu computador ou smartphone e receba as primeiras notificações hoje.",
    videoId: "dQw4w9WgXcQ",
    originalPrice: "R$ 297,00",
    discountPrice: "R$ 47,00",
    ctaText: "LIBERAR ACESSO IMEDIATO AO SOFTWARE AGORA",
    guaranteeText: "Garantia Total de Satisfação de 14 Dias",
    basicCheckoutUrl: "https://pay.kiwify.com.br/bot-basico-47",
    premiumCheckoutUrl: "https://pay.kiwify.com.br/bot-vitalicio-97",
    upsellCopy: "OPORTUNIDADE ÚNICA: Gostaria de desbloquear a Licença Ilimitada de Disparos + 50 Mensagens Validadas por míseros R$ 29,90 a mais?",
    subdomain: "software.fluxooffer.app",
    socialProofText: "🟢 Mais de 4.800 mensagens disparadas hoje",
    benefitsHeadline: "Por Que Usar Automação no WhatsApp?",
    benefitsSubheadline: "Economize dezenas de horas manuais com fluxos automáticos de resposta.",
    resourceHeadline: "Módulos Inclusos na Ferramenta",
    bonusHeadline: "Scripts de Copys Prontas de Brinde",
    basicPlanTitle: "Licença 1 Conexão",
    basicPlanPrice: "R$ 29,00",
    basicPlanCta: "QUERO A LICENÇA BÁSICA",
    premiumPlanTitle: "Licença Ilimitada VIP",
    premiumPlanPrice: "R$ 47,00",
    premiumPlanCta: "QUERO O ACESSO COMPLETO",
    authorName: "Eng. Lucas Silveira",
    authorRole: "Desenvolvedor de Automações",
    authorBio: "Especialista em APIs e ferramentas escaláveis para pequenos e médios negócios digitais.",
  },
];

export default function PageBuilderPage() {
  // Estado dos dados do Builder - Template 100k por padrão
  const [selectedTemplate, setSelectedTemplate] = useState<string>("lowticket-100k");
  const [mediaType, setMediaType] = useState<"mockup" | "vsl">("mockup");
  const [logoName, setLogoName] = useState<string>("KIT INGLÊS LÚDICO");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [badgeHero, setBadgeHero] = useState<string>(TEMPLATES[0].badgeHero);
  const [headline, setHeadline] = useState<string>(TEMPLATES[0].headline);
  const [subheadline, setSubheadline] = useState<string>(TEMPLATES[0].subheadline);
  const [socialProofText, setSocialProofText] = useState<string>(TEMPLATES[0].socialProofText);
  const [videoId, setVideoId] = useState<string>(TEMPLATES[0].videoId);
  const [smartAutoplay, setSmartAutoplay] = useState<boolean>(true);
  const [originalPrice, setOriginalPrice] = useState<string>(TEMPLATES[0].originalPrice);
  const [discountPrice, setDiscountPrice] = useState<string>(TEMPLATES[0].discountPrice);
  const [ctaText, setCtaText] = useState<string>(TEMPLATES[0].ctaText);
  const [guaranteeText, setGuaranteeText] = useState<string>(TEMPLATES[0].guaranteeText);

  // Benefícios (4 cards)
  const [benefits, setBenefits] = useState<BenefitItem[]>([
    {
      id: "b1",
      title: "Economize seu tempo",
      description: "Chega de perder horas criando folhas e desenhos no Canva do zero.",
      color: "bg-amber-400/20 text-amber-300 border-amber-500/40",
      emoji: "⏰",
    },
    {
      id: "b2",
      title: "100% Pronto para Imprimir",
      description: "Arquivos em alta definição (PDF A4), organizados e prontos em 1 clique.",
      color: "bg-cyan-400/20 text-cyan-300 border-cyan-500/40",
      emoji: "🖨️",
    },
    {
      id: "b3",
      title: "Metodologia Lúdica",
      description: "Desenhos interativos e jogos que prendem o foco de crianças agitadas.",
      color: "bg-emerald-400/20 text-emerald-300 border-emerald-500/40",
      emoji: "🎨",
    },
    {
      id: "b4",
      title: "Para Todas as Idades",
      description: "Atividades progressivas pensadas para crianças dos 3 aos 10 anos.",
      color: "bg-pink-400/20 text-pink-300 border-pink-500/40",
      emoji: "👶",
    },
  ]);

  // Carrossel de Recursos
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: "r1",
      title: "Roda das Cores & Emoções",
      tag: "JOGOS LÚDICOS",
      iconBg: "from-amber-400 to-orange-500",
      emoji: "🎡",
      description: "Atividade giratória recortável para aprender vocabulário de cores e sentimentos.",
    },
    {
      id: "r2",
      title: "Flashcards dos Animais",
      tag: "VOCABULÁRIO",
      iconBg: "from-blue-400 to-indigo-600",
      emoji: "🦁",
      description: "50 cartas ilustradas em alta resolução com pronúncia fonética guiada.",
    },
    {
      id: "r3",
      title: "Pizza dos Alimentos & Frutas",
      tag: "INTERATIVO",
      iconBg: "from-red-400 to-pink-600",
      emoji: "🍕",
      description: "Jogo da pizza de fatias para associar nomes em inglês de forma deliciosa.",
    },
    {
      id: "r4",
      title: "Labirintos & Caça-Palavras",
      tag: "FIXAÇÃO",
      iconBg: "from-emerald-400 to-teal-600",
      emoji: "🧩",
      description: "Desafios de raciocínio rápido que ensinam ortografia sem parecer lição de casa.",
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Bônus
  const [bonuses, setBonuses] = useState<BonusItem[]>([
    {
      id: "bn1",
      title: "Super Caderno de Jogos & Dinâmicas",
      originalPrice: "R$ 37,00",
      description: "30 brincadeiras práticas em grupo para quebrar o gelo em sala de aula.",
      tag: "GRÁTIS HOJE",
    },
    {
      id: "bn2",
      title: "Flashcards de Pronúncia com QR Code",
      originalPrice: "R$ 29,00",
      description: "Áudio com nativo americano escaneável direto na folha de impressão.",
      tag: "GRÁTIS HOJE",
    },
    {
      id: "bn3",
      title: "Certificado Pequeno Bilíngue em PDF",
      originalPrice: "R$ 19,00",
      description: "Modelo editável com nome da criança para celebrar a conclusão das atividades.",
      tag: "GRÁTIS HOJE",
    },
  ]);

  // Tabela de Preços (Kit Básico vs Kit Completo)
  const [basicPlanTitle, setBasicPlanTitle] = useState<string>("Coleção Básica");
  const [basicPlanPrice, setBasicPlanPrice] = useState<string>("R$ 10,00");
  const [basicPlanCta, setBasicPlanCta] = useState<string>("QUERO O PLANO BÁSICO");
  const [premiumPlanTitle, setPremiumPlanTitle] = useState<string>("Coleção Completa VIP");
  const [premiumPlanPrice, setPremiumPlanPrice] = useState<string>("R$ 27,90");
  const [premiumPlanCta, setPremiumPlanCta] = useState<string>("QUERO O PACOTE COMPLETO");

  // Autora & Bio
  const [authorName, setAuthorName] = useState<string>("Professora Mariana Castro");
  const [authorRole, setAuthorRole] = useState<string>("Especialista em Educação Infantil Bilíngue");
  const [authorBio, setAuthorBio] = useState<string>(
    "Educadora apaixonada com mais de 10 anos de experiência em sala de aula. Criou este kit para ajudar professores a terem aulas mágicas sem passar a noite inteira planejando."
  );

  // FAQ
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: "f1",
      question: "Como vou receber o material?",
      answer: "Imediatamente após a confirmação do pagamento, você recebe um e-mail com o link exclusivo para baixar todos os arquivos em PDF prontos para imprimir.",
    },
    {
      id: "f2",
      question: "O acesso é vitalício?",
      answer: "Sim! Você pode baixar no seu computador, celular ou tablet quantas vezes quiser e o material é seu para sempre, incluindo futuras atualizações.",
    },
    {
      id: "f3",
      question: "Serve para quais idades?",
      answer: "O kit foi pedagogicamente estruturado para crianças de 3 a 10 anos, cobrindo desde a alfabetização visual até pequenos textos e vocabulário avançado.",
    },
    {
      id: "f4",
      question: "Como funciona a garantia de 7 dias?",
      answer: "Se por qualquer motivo você não amar o material, basta mandar um único e-mail para o nosso suporte e nós reembolsamos 100% do seu dinheiro, sem burocracia.",
    },
  ]);

  // Upsell
  const [interceptUpsell, setInterceptUpsell] = useState<boolean>(true);
  const [basicCheckoutUrl, setBasicCheckoutUrl] = useState<string>(TEMPLATES[0].basicCheckoutUrl);
  const [premiumCheckoutUrl, setPremiumCheckoutUrl] = useState<string>(TEMPLATES[0].premiumCheckoutUrl);
  const [upsellCopy, setUpsellCopy] = useState<string>(TEMPLATES[0].upsellCopy);

  // Tracking & Deploy
  const [metaPixel, setMetaPixel] = useState<string>(
    `<!-- Meta Pixel Code -->\nfbq('init', '984712039481234');\nfbq('track', 'PageView');`
  );
  const [googlePixel, setGooglePixel] = useState<string>(
    `<!-- Google tag (gtag.js) -->\ngtag('config', 'AW-11948201948');`
  );
  const [tiktokPixel, setTiktokPixel] = useState<string>(
    `<!-- TikTok Pixel Code -->\nttq.load('C188KJ28F719');\nttq.page();`
  );
  const [subdomain, setSubdomain] = useState<string>(TEMPLATES[0].subdomain);

  // Viewport & Preview Settings
  const [viewportMode, setViewportMode] = useState<"desktop" | "iphone">("iphone");
  const [previewTheme, setPreviewTheme] = useState<"pastel" | "dark">("pastel");
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Mobile/Tablet Tab Switcher for the Builder Layout itself
  const [builderTab, setBuilderTab] = useState<"editor" | "preview">("preview");

  // Deploy simulation state
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployProgress, setDeployProgress] = useState<number>(0);
  const [deployStep, setDeployStep] = useState<string>("");
  const [deployCompleted, setDeployCompleted] = useState<boolean>(false);

  // Timer regressivo
  const [timerSeconds, setTimerSeconds] = useState<number>(764);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Troca de Template
  const handleSelectTemplate = (tpl: TemplateItem) => {
    setSelectedTemplate(tpl.id);
    setMediaType(tpl.mediaType);
    setBadgeHero(tpl.badgeHero);
    setHeadline(tpl.headline);
    setSubheadline(tpl.subheadline);
    setVideoId(tpl.videoId);
    setOriginalPrice(tpl.originalPrice);
    setDiscountPrice(tpl.discountPrice);
    setCtaText(tpl.ctaText);
    setGuaranteeText(tpl.guaranteeText);
    setBasicCheckoutUrl(tpl.basicCheckoutUrl);
    setPremiumCheckoutUrl(tpl.premiumCheckoutUrl);
    setUpsellCopy(tpl.upsellCopy);
    setSubdomain(tpl.subdomain);
    setSocialProofText(tpl.socialProofText);
    setBasicPlanTitle(tpl.basicPlanTitle);
    setBasicPlanPrice(tpl.basicPlanPrice);
    setBasicPlanCta(tpl.basicPlanCta);
    setPremiumPlanTitle(tpl.premiumPlanTitle);
    setPremiumPlanPrice(tpl.premiumPlanPrice);
    setPremiumPlanCta(tpl.premiumPlanCta);
    setAuthorName(tpl.authorName);
    setAuthorRole(tpl.authorRole);
    setAuthorBio(tpl.authorBio);
    if (tpl.id === "lowticket-100k") {
      setPreviewTheme("pastel");
    }
  };

  const handleAddResource = () => {
    const newId = `r${resources.length + 1}`;
    setResources([
      ...resources,
      {
        id: newId,
        title: `Novo Recurso ${resources.length + 1}`,
        tag: "ATIVIDADE",
        iconBg: "from-purple-400 to-pink-500",
        emoji: "⭐",
        description: "Folhas práticas ilustradas para fixação e memorização.",
      },
    ]);
  };

  const handleRemoveResource = (id: string) => {
    if (resources.length <= 1) return;
    setResources(resources.filter((r) => r.id !== id));
    setCurrentSlide(0);
  };

  // Simulação de Deploy
  const startDeploy = () => {
    setIsDeploying(true);
    setDeployProgress(5);
    setDeployStep("Iniciando build na infraestrutura Vercel Edge...");
    setDeployCompleted(false);

    setTimeout(() => {
      setDeployProgress(28);
      setDeployStep("Otimizando assets e minificando imagens do kit...");
    }, 700);

    setTimeout(() => {
      setDeployProgress(56);
      setDeployStep("Injetando Pixels de Conversão (Meta, Google, TikTok)...");
    }, 1500);

    setTimeout(() => {
      setDeployProgress(82);
      setDeployStep("Compilando lógica do Pop-up de Upsell...");
    }, 2300);

    setTimeout(() => {
      setDeployProgress(100);
      setDeployStep(`Deploy concluído com sucesso em https://${subdomain}`);
      setIsDeploying(false);
      setDeployCompleted(true);
    }, 3200);
  };

  const copyLiveUrl = () => {
    navigator.clipboard.writeText(`https://${subdomain}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-600/30 font-black text-sm">
            FO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Page Builder Low-Ticket
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40">
                  {selectedTemplate === "lowticket-100k" ? "🏆 Validado 100k" : "Alta Conversão"}
                </span>
              </h1>
            </div>
            <p className="hidden sm:block text-[11px] text-zinc-400 leading-none">
              Criação rápida com imagens, carrossel de recursos, bônus e deploy Vercel
            </p>
          </div>
        </div>

        {/* Builder View Mode Switcher on Mobile Screens */}
        <div className="flex lg:hidden items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setBuilderTab("editor")}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              builderTab === "editor" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setBuilderTab("preview")}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              builderTab === "preview" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-300">
              {subdomain}
            </span>
          </div>

          <Button
            size="sm"
            onClick={startDeploy}
            disabled={isDeploying}
            className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/50 cursor-pointer h-8 text-xs px-3"
          >
            {isDeploying ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Rocket className="h-3.5 w-3.5 mr-1.5" />
            )}
            <span className="hidden sm:inline">{isDeploying ? "Deployando..." : "Publicar Página"}</span>
            <span className="sm:hidden">Deploy</span>
          </Button>
        </div>
      </div>

      {/* Deploy Notification */}
      {(isDeploying || deployCompleted) && (
        <div className="px-5 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  {deployCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 text-red-400 animate-spin" />
                  )}
                  {deployStep}
                </span>
                <span className="text-red-400 font-bold">{deployProgress}%</span>
              </div>
              <Progress value={deployProgress} className="h-1.5 bg-zinc-800" />
            </div>
          </div>
          {deployCompleted && (
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="xs"
                onClick={copyLiveUrl}
                className="border-zinc-700 text-zinc-200 hover:border-red-500 hover:text-white"
              >
                <Copy className="h-3 w-3 mr-1" />
                {copiedUrl ? "Copiado!" : "Copiar Link"}
              </Button>
              <a
                href={`https://${subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-semibold text-red-400 hover:text-red-300 underline underline-offset-4"
              >
                Visitar Página
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Main Builder Resizable Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          {/* LADO ESQUERDO: Painel de Configurações */}
          <ResizablePanel
            id="sidebar-config"
            defaultSize="35%"
            minSize="28%"
            maxSize="45%"
            className={`bg-zinc-950 flex flex-col h-full border-r border-zinc-800/80 ${
              builderTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="flex flex-col h-full overflow-hidden">
              <Tabs defaultValue="templates" className="flex flex-col h-full">
                {/* Tabs Navigation */}
                <div className="p-3 pb-0 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
                  <TabsList className="grid grid-cols-4 w-full bg-zinc-950 p-1 border border-zinc-800 rounded-lg h-9">
                    <TabsTrigger
                      value="templates"
                      className="text-xs data-[active]:bg-red-600 data-[active]:text-white data-[active]:font-bold data-[active]:shadow-md transition-all gap-1 cursor-pointer py-1"
                    >
                      <LayoutTemplate className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">Templates</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="copy"
                      className="text-xs data-[active]:bg-red-600 data-[active]:text-white data-[active]:font-bold data-[active]:shadow-md transition-all gap-1 cursor-pointer py-1"
                    >
                      <Type className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">Seções</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="upsell"
                      className="text-xs data-[active]:bg-red-600 data-[active]:text-white data-[active]:font-bold data-[active]:shadow-md transition-all gap-1 cursor-pointer py-1"
                    >
                      <Coins className="h-3.5 w-3.5 shrink-0 text-amber-400 data-[active]:text-white" />
                      <span className="hidden sm:inline">Upsell</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="deploy"
                      className="text-xs data-[active]:bg-red-600 data-[active]:text-white data-[active]:font-bold data-[active]:shadow-md transition-all gap-1 cursor-pointer py-1"
                    >
                      <Rocket className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">Deploy</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tabs Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* TAB 1: TEMPLATES */}
                  <TabsContent value="templates" className="space-y-4 m-0 outline-none">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Flame className="h-4 w-4 text-red-500" />
                          Templates Validados de Venda
                        </h2>
                        <span className="text-[11px] text-zinc-400">
                          Selecione para carregar
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Estruturas completas para kits sem VSL ou funis tradicionais de resposta direta.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {TEMPLATES.map((tpl) => {
                        const isSelected = selectedTemplate === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            onClick={() => handleSelectTemplate(tpl)}
                            className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-r from-red-950/40 to-zinc-900 border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-600/50"
                                : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`p-1.5 rounded-lg ${
                                    isSelected
                                      ? "bg-red-600 text-white"
                                      : "bg-zinc-800 text-zinc-300 group-hover:text-red-400"
                                  }`}
                                >
                                  {tpl.id === "lowticket-100k" ? (
                                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                                  ) : (
                                    <Flame className="h-3.5 w-3.5" />
                                  )}
                                </div>
                                <span className="font-bold text-sm text-zinc-100 group-hover:text-white">
                                  {tpl.name}
                                </span>
                              </div>
                              {tpl.badge && (
                                <Badge className="bg-red-600 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm shadow-red-600/50 border-0 px-2 py-0.5">
                                  {tpl.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {tpl.description}
                            </p>
                            <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                              <span className="font-mono text-zinc-400">
                                Modelo: {tpl.mediaType === "mockup" ? "🖼️ Mockup/Imagens" : "🎥 VSL"}
                              </span>
                              <span
                                className={`font-semibold ${
                                  isSelected ? "text-red-400" : "text-zinc-400"
                                }`}
                              >
                                {isSelected ? "✓ Ativo no Editor" : "Usar este"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* TAB 2: SEÇÕES & COPY (MODULAR) */}
                  <TabsContent value="copy" className="space-y-4 m-0 outline-none">
                    <div className="space-y-1">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="h-4 w-4 text-red-500" />
                        Edição de Seções da Página
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Alterne e personalize cada bloco da landing page com resposta visual instantânea.
                      </p>
                    </div>

                    {/* Seletor do Tipo de Mídia Hero */}
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <Label className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                        Tipo de Apresentação no Topo (Hero)
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMediaType("mockup")}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            mediaType === "mockup"
                              ? "bg-red-600/20 border-red-500 text-white shadow-sm shadow-red-500/30"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                          <span>Mockup 3D do Kit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaType("vsl")}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            mediaType === "vsl"
                              ? "bg-red-600/20 border-red-500 text-white shadow-sm shadow-red-500/30"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <Play className="h-3.5 w-3.5 text-red-500" />
                          <span>VSL / Vídeo Direto</span>
                        </button>
                      </div>
                    </div>

                    <Accordion defaultValue={["hero", "carrossel", "pricing"]} className="w-full space-y-2">
                      {/* Accordion Item: Header & Hero */}
                      <AccordionItem value="hero">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-red-500" />
                            <span>1. Topo & Grande Promessa (Hero)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3.5">
                          {/* Tag Amarela do Topo */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Tag/Badge do Topo
                            </Label>
                            <Input
                              value={badgeHero}
                              onChange={(e) => setBadgeHero(e.target.value)}
                              placeholder="Ex: KIT ATIVIDADES DE INGLÊS (+200 FOLHAS)"
                              className="h-8 text-xs bg-zinc-950 border-zinc-800 focus-visible:border-red-500"
                            />
                          </div>

                          {/* Headline */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Headline Principal
                            </Label>
                            <Textarea
                              value={headline}
                              onChange={(e) => setHeadline(e.target.value)}
                              placeholder="Suas aulas de inglês nunca mais serão as mesmas..."
                              rows={3}
                              className="text-xs bg-zinc-950 border-zinc-800 focus-visible:border-red-500 font-medium leading-relaxed"
                            />
                          </div>

                          {/* Subheadline */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Subheadline de Apoio
                            </Label>
                            <Textarea
                              value={subheadline}
                              onChange={(e) => setSubheadline(e.target.value)}
                              placeholder="O material testado e aprovado..."
                              rows={2}
                              className="text-xs bg-zinc-950 border-zinc-800 focus-visible:border-red-500 leading-relaxed"
                            />
                          </div>

                          {/* Botão CTA Principal */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Texto do Botão de Compra (CTA)
                            </Label>
                            <Input
                              value={ctaText}
                              onChange={(e) => setCtaText(e.target.value)}
                              placeholder="EU QUERO O MATERIAL AGORA"
                              className="h-8 text-xs bg-zinc-950 border-zinc-800 font-bold focus-visible:border-red-500"
                            />
                          </div>

                          {/* Prova Social */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Texto de Avaliação / Estrelas
                            </Label>
                            <Input
                              value={socialProofText}
                              onChange={(e) => setSocialProofText(e.target.value)}
                              placeholder="⭐⭐⭐⭐⭐ 4.9/5 (+ de 12.400 clientes satisfeitos)"
                              className="h-8 text-xs bg-zinc-950 border-zinc-800 focus-visible:border-red-500"
                            />
                          </div>

                          {/* Se for VSL */}
                          {mediaType === "vsl" && (
                            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                              <Label className="text-xs text-zinc-300 font-medium">
                                ID do Vídeo (YouTube ou Vimeo)
                              </Label>
                              <Input
                                value={videoId}
                                onChange={(e) => setVideoId(e.target.value)}
                                placeholder="Ex: dQw4w9WgXcQ"
                                className="h-8 text-xs bg-zinc-950 border-zinc-800 font-mono focus-visible:border-red-500"
                              />
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Benefícios */}
                      <AccordionItem value="benefits">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>2. Cards de Benefícios (4 Destaques)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          {benefits.map((b, idx) => (
                            <div
                              key={b.id}
                              className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{b.emoji}</span>
                                <Input
                                  value={b.title}
                                  onChange={(e) => {
                                    const next = [...benefits];
                                    next[idx].title = e.target.value;
                                    setBenefits(next);
                                  }}
                                  className="h-7 text-xs font-bold bg-zinc-900 border-zinc-800"
                                />
                              </div>
                              <Input
                                value={b.description}
                                onChange={(e) => {
                                  const next = [...benefits];
                                  next[idx].description = e.target.value;
                                  setBenefits(next);
                                }}
                                className="h-7 text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
                              />
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Carrossel de Recursos */}
                      <AccordionItem value="carrossel">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-amber-400" />
                            <span>3. Carrossel de Recursos do Kit ({resources.length})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-400">
                              Fotos e prévias do que o cliente vai receber.
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={handleAddResource}
                              className="border-zinc-700 text-xs text-red-400 hover:text-white"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {resources.map((res, idx) => (
                              <div
                                key={res.id}
                                className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2 relative"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{res.emoji}</span>
                                    <span className="text-xs font-bold text-zinc-200">
                                      Slide #{idx + 1}
                                    </span>
                                  </div>
                                  {resources.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveResource(res.id)}
                                      className="text-zinc-500 hover:text-red-400 text-xs"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    value={res.title}
                                    onChange={(e) => {
                                      const next = [...resources];
                                      next[idx].title = e.target.value;
                                      setResources(next);
                                    }}
                                    placeholder="Título do Recurso"
                                    className="h-7 text-xs bg-zinc-900 border-zinc-800"
                                  />
                                  <Input
                                    value={res.tag}
                                    onChange={(e) => {
                                      const next = [...resources];
                                      next[idx].tag = e.target.value;
                                      setResources(next);
                                    }}
                                    placeholder="Tag (ex: JOGOS)"
                                    className="h-7 text-xs bg-zinc-900 border-zinc-800 font-mono"
                                  />
                                </div>
                                <Input
                                  value={res.description}
                                  onChange={(e) => {
                                    const next = [...resources];
                                    next[idx].description = e.target.value;
                                    setResources(next);
                                  }}
                                  placeholder="Descrição do material..."
                                  className="h-7 text-xs bg-zinc-900 border-zinc-800"
                                />
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Bônus */}
                      <AccordionItem value="bonuses">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-pink-400" />
                            <span>4. Bônus / Presentes Liberados</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          {bonuses.map((bn, idx) => (
                            <div
                              key={bn.id}
                              className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-pink-400">
                                  Bônus #{idx + 1}
                                </span>
                                <span className="text-[11px] text-zinc-500 font-mono line-through">
                                  {bn.originalPrice}
                                </span>
                              </div>
                              <Input
                                value={bn.title}
                                onChange={(e) => {
                                  const next = [...bonuses];
                                  next[idx].title = e.target.value;
                                  setBonuses(next);
                                }}
                                className="h-7 text-xs font-semibold bg-zinc-900 border-zinc-800"
                              />
                              <Input
                                value={bn.description}
                                onChange={(e) => {
                                  const next = [...bonuses];
                                  next[idx].description = e.target.value;
                                  setBonuses(next);
                                }}
                                className="h-7 text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
                              />
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Tabela de Preços (Kits) */}
                      <AccordionItem value="pricing">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-red-500" />
                            <span>5. Tabela Dupla de Kits (Básico vs VIP)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3.5">
                          {/* Plano Básico */}
                          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase">
                              Opção 1: Plano Básico
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-[11px] text-zinc-400">Nome</Label>
                                <Input
                                  value={basicPlanTitle}
                                  onChange={(e) => setBasicPlanTitle(e.target.value)}
                                  className="h-7 text-xs bg-zinc-900 border-zinc-800"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px] text-zinc-400">Preço</Label>
                                <Input
                                  value={basicPlanPrice}
                                  onChange={(e) => setBasicPlanPrice(e.target.value)}
                                  className="h-7 text-xs font-bold bg-zinc-900 border-zinc-800"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Plano VIP Completo */}
                          <div className="p-3 rounded-xl border-2 border-red-600/60 bg-red-950/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-red-400 uppercase">
                                Opção 2: Plano Completo VIP (Mais Vendido)
                              </span>
                              <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0.5">
                                Destaque
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-[11px] text-zinc-400">Nome</Label>
                                <Input
                                  value={premiumPlanTitle}
                                  onChange={(e) => setPremiumPlanTitle(e.target.value)}
                                  className="h-7 text-xs bg-zinc-900 border-zinc-800 text-white font-bold"
                                />
                              </div>
                              <div>
                                <Label className="text-[11px] text-red-400">Preço com Bônus</Label>
                                <Input
                                  value={premiumPlanPrice}
                                  onChange={(e) => setPremiumPlanPrice(e.target.value)}
                                  className="h-7 text-xs font-black text-red-400 bg-zinc-900 border-red-600/50"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Autora & Bio */}
                      <AccordionItem value="author">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-400" />
                            <span>6. Bio do Autor & Garantia</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">Nome do Autor</Label>
                            <Input
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              className="h-8 text-xs bg-zinc-950 border-zinc-800"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">Credencial/Especialidade</Label>
                            <Input
                              value={authorRole}
                              onChange={(e) => setAuthorRole(e.target.value)}
                              className="h-8 text-xs bg-zinc-950 border-zinc-800"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-zinc-300 font-medium">Texto de Conexão (Bio)</Label>
                            <Textarea
                              value={authorBio}
                              onChange={(e) => setAuthorBio(e.target.value)}
                              rows={3}
                              className="text-xs bg-zinc-950 border-zinc-800 leading-relaxed"
                            />
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <Label className="text-xs text-zinc-300 font-medium">Texto da Garantia</Label>
                            <Input
                              value={guaranteeText}
                              onChange={(e) => setGuaranteeText(e.target.value)}
                              className="h-8 text-xs bg-zinc-950 border-zinc-800"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: FAQ */}
                      <AccordionItem value="faq">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-indigo-400" />
                            <span>7. Perguntas Frequentes (FAQ)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          {faqs.map((f, idx) => (
                            <div
                              key={f.id}
                              className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-1.5"
                            >
                              <Input
                                value={f.question}
                                onChange={(e) => {
                                  const next = [...faqs];
                                  next[idx].question = e.target.value;
                                  setFaqs(next);
                                }}
                                className="h-7 text-xs font-bold bg-zinc-900 border-zinc-800"
                              />
                              <Textarea
                                value={f.answer}
                                onChange={(e) => {
                                  const next = [...faqs];
                                  next[idx].answer = e.target.value;
                                  setFaqs(next);
                                }}
                                rows={2}
                                className="text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
                              />
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>

                  {/* TAB 3: LÓGICA DE UPSELL (OURO) */}
                  <TabsContent value="upsell" className="space-y-4 m-0 outline-none">
                    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-zinc-900 to-zinc-950 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                            <Coins className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            Multiplicador de Ticket Médio
                          </span>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                          Estratégia Ouro
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Ao clicar para comprar o kit de {basicPlanPrice}, o cliente é interceptado por um modal exclusivo oferecendo o kit completo por apenas mais alguns reais!
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="space-y-0.5 pr-2">
                        <Label className="text-xs font-bold text-white cursor-pointer flex items-center gap-1.5">
                          <Flame className="h-3.5 w-3.5 text-red-500" />
                          Interceptar Clique Básico (Pop-up de Upsell)
                        </Label>
                        <p className="text-[11px] text-zinc-400">
                          Ao tentar comprar o plano simples, exibe modal persuasivo de upgrade imediato.
                        </p>
                      </div>
                      <Switch
                        checked={interceptUpsell}
                        onCheckedChange={(checked) => setInterceptUpsell(!!checked)}
                      />
                    </div>

                    {interceptUpsell && (
                      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3.5 animate-in fade-in-50 duration-200">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-zinc-300 font-medium">
                            Link do Checkout - Plano Básico
                          </Label>
                          <Input
                            value={basicCheckoutUrl}
                            onChange={(e) => setBasicCheckoutUrl(e.target.value)}
                            placeholder="https://pay.kiwify.com.br/kit-basico-10"
                            className="h-8 text-xs bg-zinc-950 border-zinc-800 font-mono text-zinc-300 focus-visible:border-red-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-red-400 font-bold">
                            Link do Checkout - Plano Completo VIP (Upsell)
                          </Label>
                          <Input
                            value={premiumCheckoutUrl}
                            onChange={(e) => setPremiumCheckoutUrl(e.target.value)}
                            placeholder="https://pay.kiwify.com.br/kit-completo-27"
                            className="h-8 text-xs bg-zinc-950 border-red-600/40 font-mono text-red-300 focus-visible:border-red-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-zinc-300 font-medium">
                              Copy do Modal de Upsell
                            </Label>
                            <span className="text-[10px] text-zinc-500">
                              Gatilho de Urgência
                            </span>
                          </div>
                          <Textarea
                            value={upsellCopy}
                            onChange={(e) => setUpsellCopy(e.target.value)}
                            placeholder="Espera! Leve também o template X por apenas..."
                            rows={3}
                            className="text-xs bg-zinc-950 border-zinc-800 focus-visible:border-red-500 leading-relaxed font-medium"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsUpsellModalOpen(true)}
                          className="w-full border-red-600/50 text-red-400 hover:bg-red-950/30 hover:text-white text-xs h-8 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Simular Exibição do Modal Agora
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 4: TRACKING & DEPLOY */}
                  <TabsContent value="deploy" className="space-y-4 m-0 outline-none">
                    <div className="space-y-1">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="h-4 w-4 text-red-500" />
                        Tracking de Tráfego & Pixels
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Injeção ultra-rápida no Edge sem afetar a velocidade de carregamento (Core Web Vitals 99+).
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-blue-400" />
                          Meta Pixel (Facebook/Instagram Ads)
                        </Label>
                        <Textarea
                          value={metaPixel}
                          onChange={(e) => setMetaPixel(e.target.value)}
                          rows={2}
                          className="font-mono text-[11px] bg-zinc-950 border-zinc-800 focus-visible:border-red-500 text-zinc-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-amber-400" />
                          Google Tag / Ads
                        </Label>
                        <Textarea
                          value={googlePixel}
                          onChange={(e) => setGooglePixel(e.target.value)}
                          rows={2}
                          className="font-mono text-[11px] bg-zinc-950 border-zinc-800 focus-visible:border-red-500 text-zinc-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-pink-400" />
                          TikTok Pixel
                        </Label>
                        <Textarea
                          value={tiktokPixel}
                          onChange={(e) => setTiktokPixel(e.target.value)}
                          rows={2}
                          className="font-mono text-[11px] bg-zinc-950 border-zinc-800 focus-visible:border-red-500 text-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Integração Vercel / GitHub
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300 font-medium">
                          Nome do Subdomínio
                        </Label>
                        <Input
                          value={subdomain}
                          onChange={(e) => setSubdomain(e.target.value)}
                          placeholder="kit-atividades.fluxooffer.app"
                          className="h-8 text-xs bg-zinc-950 border-zinc-800 font-mono text-zinc-200 focus-visible:border-red-500"
                        />
                        <p className="text-[10px] text-zinc-500">
                          SSL automático, CDN global Anycast e edge caching instantâneo.
                        </p>
                      </div>

                      {/* Botão com Glow Effect */}
                      <Button
                        type="button"
                        onClick={startDeploy}
                        disabled={isDeploying}
                        className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 border border-red-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        {isDeploying ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Compilando & Gerando Deploy...
                          </>
                        ) : (
                          <>
                            🚀 Gerar Código & Deploy na Vercel
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          {/* Separador Ajustável */}
          <ResizableHandle withHandle className="hidden lg:flex" />

          {/* LADO DIREITO: Live Preview */}
          <ResizablePanel
            id="preview-panel"
            defaultSize="65%"
            minSize="55%"
            className={`bg-zinc-950 flex flex-col h-full overflow-hidden ${
              builderTab === "editor" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Header de Controles do Preview */}
            <div className="px-3 sm:px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-2">
                {/* Device Viewport Toggle */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setViewportMode("iphone")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      viewportMode === "iphone"
                        ? "bg-red-600 text-white shadow-sm shadow-red-600/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>iPhone 16 Pro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode("desktop")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      viewportMode === "desktop"
                        ? "bg-red-600 text-white shadow-sm shadow-red-600/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>

                {/* Alternador de Tema Pastel x Dark */}
                <div className="hidden sm:flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("pastel")}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      previewTheme === "pastel"
                        ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-500/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    🎨 Pastel 100k
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      previewTheme === "dark"
                        ? "bg-red-600/20 text-red-300 font-bold border border-red-500/40"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    🌑 Dark
                  </button>
                </div>
              </div>

              {/* Botão de Teste de Upsell */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpsellModalOpen(true)}
                className="border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs h-7 gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer shrink-0"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Testar Fluxo de Upsell</span>
                <span className="sm:hidden">Upsell</span>
              </Button>
            </div>

            {/* Container Canvas de Visualização */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex items-start justify-center bg-zinc-950/80">
              {viewportMode === "iphone" ? (
                /* MOLDURA AUTÊNTICA DE IPHONE 16 PRO COM SCROLL INTERNO */
                <div className="w-[380px] h-[780px] max-h-[calc(100vh-140px)] rounded-[50px] p-2.5 bg-zinc-900 border-[3.5px] border-zinc-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col relative shrink-0 my-auto">
                  {/* Speaker and Camera dynamic island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-md">
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                    <div className="h-2 w-2 rounded-full bg-blue-950/80 ring-1 ring-blue-500/30" />
                  </div>

                  {/* Internal Phone Screen Container */}
                  <div className="w-full h-full rounded-[42px] overflow-hidden flex flex-col relative bg-zinc-950">
                    {/* iOS Status Bar */}
                    <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-bold text-zinc-300 bg-black/40 backdrop-blur-md z-20 shrink-0 select-none">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Wifi className="h-3 w-3" />
                        <Battery className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {/* SCROLL INTERNO DA PÁGINA DENTRO DO CELULAR */}
                    <div
                      className={`flex-1 overflow-y-auto ${
                        previewTheme === "pastel"
                          ? "bg-gradient-to-b from-[#fefbf6] via-[#f7fcf9] to-[#fffbf7] text-zinc-900"
                          : "bg-zinc-950 text-zinc-100"
                      }`}
                    >
                      {/* Faixa de Urgência Topo */}
                      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-1.5 px-3 text-center text-[10px] font-black tracking-wide flex items-center justify-center gap-1.5 shadow-sm">
                        <Clock className="h-3 w-3 animate-pulse shrink-0" />
                        <span>OFERTA ENCERRA EM</span>
                        <span className="font-mono bg-black/30 px-1 py-0.5 rounded text-yellow-300 font-bold">
                          {formatTimer(timerSeconds)}
                        </span>
                      </div>

                      {/* Header da Landing Page */}
                      <header
                        className={`py-2.5 px-4 flex items-center justify-between border-b ${
                          previewTheme === "pastel"
                            ? "bg-white/80 border-zinc-200/80 backdrop-blur-sm"
                            : "bg-zinc-950/90 border-zinc-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-4 w-4 rounded bg-red-600 flex items-center justify-center text-[9px] text-white font-black">
                            ★
                          </span>
                          <span className={`font-black text-xs tracking-tight ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                            {logoName || "FLUXO OFFER"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="h-2.5 w-2.5" />
                          <span>100% Segura</span>
                        </div>
                      </header>

                      {/* HERO SECTION MOBILE */}
                      <section className="p-4 space-y-3.5 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-900 text-[9px] font-black uppercase tracking-wider shadow-sm">
                          <Sparkles className="h-2.5 w-2.5" />
                          {badgeHero}
                        </div>

                        <h2
                          className={`text-lg font-black tracking-tight leading-snug px-1 ${
                            previewTheme === "pastel" ? "text-zinc-950" : "text-white"
                          }`}
                        >
                          {headline}
                        </h2>

                        <p
                          className={`text-[11px] leading-relaxed px-1 ${
                            previewTheme === "pastel" ? "text-zinc-600" : "text-zinc-400"
                          }`}
                        >
                          {subheadline}
                        </p>

                        {/* MOCKUP 3D ADAPTADO PERFEITAMENTE PARA MOBILE */}
                        {mediaType === "mockup" ? (
                          <div className="relative my-2 p-2.5 rounded-2xl bg-gradient-to-b from-amber-100/70 to-orange-100/50 border-2 border-dashed border-amber-300 shadow-lg">
                            <div className="rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-zinc-200">
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 flex flex-col items-center justify-center text-center">
                                  <span className="text-xl mb-0.5">🎡</span>
                                  <span className="text-[10px] font-black text-zinc-800">Roda Cores</span>
                                  <span className="text-[8px] text-zinc-500">+30 Vocabulários</span>
                                </div>
                                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-2 flex flex-col items-center justify-center text-center">
                                  <span className="text-xl mb-0.5">🦁</span>
                                  <span className="text-[10px] font-black text-zinc-800">Flashcards</span>
                                  <span className="text-[8px] text-zinc-500">Desenhos & Áudio</span>
                                </div>
                                <div className="rounded-lg border border-pink-200 bg-pink-50 p-2 flex flex-col items-center justify-center text-center">
                                  <span className="text-xl mb-0.5">🍕</span>
                                  <span className="text-[10px] font-black text-zinc-800">Pizza Frutas</span>
                                  <span className="text-[8px] text-zinc-500">Alimentos Inglês</span>
                                </div>
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 flex flex-col items-center justify-center text-center">
                                  <span className="text-xl mb-0.5">🏆</span>
                                  <span className="text-[10px] font-black text-zinc-800">Certificado</span>
                                  <span className="text-[8px] text-zinc-500">PDF Alta Qualidade</span>
                                </div>
                              </div>

                              <div className="mt-1.5 py-1 px-2 rounded-md bg-red-600 text-white font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm">
                                <span>📦 +200 ATIVIDADES EM PDF</span>
                              </div>
                            </div>

                            <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 font-black text-[9px] shadow-md shadow-red-500/50 rotate-12">
                              80% OFF
                            </div>
                          </div>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md aspect-video">
                            {videoId ? (
                              <iframe
                                className="w-full h-full pointer-events-none"
                                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0`}
                                title="VSL Mobile"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                                Vídeo ID não informado
                              </div>
                            )}
                          </div>
                        )}

                        {/* Botão CTA Principal */}
                        <div className="pt-1 space-y-1.5">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (interceptUpsell) {
                                setIsUpsellModalOpen(true);
                              } else {
                                window.open(basicCheckoutUrl, "_blank");
                              }
                            }}
                            className="w-full py-4 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-600/40 animate-pulse border border-red-400/40 cursor-pointer"
                          >
                            {ctaText}
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Button>
                          <p className={`text-[10px] font-semibold ${previewTheme === "pastel" ? "text-zinc-600" : "text-zinc-400"}`}>
                            {socialProofText}
                          </p>
                        </div>
                      </section>

                      {/* BENEFÍCIOS MOBILE (4 CARDS) */}
                      <section
                        className={`py-5 px-3 border-t ${
                          previewTheme === "pastel" ? "bg-white/80 border-zinc-200" : "bg-zinc-900/60 border-zinc-900"
                        }`}
                      >
                        <div className="text-center space-y-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase text-amber-500">
                              VANTAGENS
                            </span>
                            <h3 className={`text-sm font-black ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                              Inglês que prende a atenção das crianças
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-left">
                            {benefits.map((b) => (
                              <div
                                key={b.id}
                                className={`p-2.5 rounded-xl border shadow-xs space-y-1 ${
                                  previewTheme === "pastel" ? "bg-white border-zinc-200" : "bg-zinc-950 border-zinc-800"
                                }`}
                              >
                                <span className="text-lg block">{b.emoji}</span>
                                <h4 className="text-[10px] font-black leading-tight">{b.title}</h4>
                                <p className="text-[9px] text-zinc-500 leading-tight">{b.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      {/* CARROSSEL MOBILE COM BOTÕES EMBUTIDOS (NUNCA CORTA) */}
                      <section
                        className={`py-5 px-3 border-t ${
                          previewTheme === "pastel" ? "bg-amber-50/40 border-amber-200/60" : "bg-zinc-900/40 border-zinc-900"
                        }`}
                      >
                        <div className="space-y-3 text-center">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-zinc-900">
                              RECURSOS DO KIT
                            </span>
                            <h3 className={`text-sm font-black ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                              Veja alguns dos recursos
                            </h3>
                          </div>

                          {/* Card do Slide com Botões Integrados */}
                          <div
                            className={`p-3.5 rounded-2xl border-2 shadow-sm text-left relative ${
                              previewTheme === "pastel" ? "bg-white border-zinc-200" : "bg-zinc-950 border-zinc-800"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resources[currentSlide].iconBg} flex items-center justify-center text-2xl shadow-sm shrink-0`}
                              >
                                {resources[currentSlide].emoji}
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-700">
                                  {resources[currentSlide].tag}
                                </span>
                                <h4 className="text-xs font-black leading-tight">
                                  {resources[currentSlide].title}
                                </h4>
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                              {resources[currentSlide].description}
                            </p>

                            {/* Controles de Navegação Dentro do Card */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                              <span className="text-[9px] font-mono text-zinc-400">
                                Slide {currentSlide + 1} de {resources.length}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : resources.length - 1))}
                                  className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                >
                                  <ChevronLeft className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCurrentSlide((prev) => (prev < resources.length - 1 ? prev + 1 : 0))}
                                  className="h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* 3 PASSOS SIMPLES MOBILE */}
                      <section className="py-5 px-3">
                        <div className="space-y-2 text-center">
                          <h4 className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300">
                            Em 3 passos simples
                          </h4>
                          <div className="space-y-1.5 text-left">
                            <div className="p-2.5 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center gap-2.5">
                              <span className="text-lg">💳</span>
                              <div>
                                <h5 className="text-[10px] font-black">1. Faça sua inscrição</h5>
                                <p className="text-[9px] text-zinc-500">Pagamento 100% seguro via Pix ou Cartão.</p>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center gap-2.5">
                              <span className="text-lg">📩</span>
                              <div>
                                <h5 className="text-[10px] font-black">2. Receba no E-mail</h5>
                                <p className="text-[9px] text-zinc-500">Acesso liberado de forma imediata.</p>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 flex items-center gap-2.5">
                              <span className="text-lg">🖨️</span>
                              <div>
                                <h5 className="text-[10px] font-black">3. Imprima e Encante</h5>
                                <p className="text-[9px] text-zinc-500">Baixe e use com as crianças hoje mesmo.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* BÔNUS MOBILE */}
                      <section
                        className={`py-5 px-3 border-t ${
                          previewTheme === "pastel" ? "bg-amber-50/50 border-amber-200/80" : "bg-zinc-900/60 border-zinc-900"
                        }`}
                      >
                        <div className="space-y-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase shadow-sm">
                            BÔNUS HOJE
                          </span>
                          <h4 className="text-xs font-black">Presentes Liberados Apenas Hoje!</h4>
                          <div className="space-y-2 text-left">
                            {bonuses.map((bn) => (
                              <div
                                key={bn.id}
                                className="p-2.5 rounded-xl border-2 border-dashed border-amber-300 bg-white dark:bg-zinc-900 space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase">
                                    {bn.tag}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 line-through">
                                    De {bn.originalPrice}
                                  </span>
                                </div>
                                <h5 className="text-[10px] font-black leading-tight">{bn.title}</h5>
                                <p className="text-[9px] text-zinc-500 leading-tight">{bn.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>

                      {/* TABELA DE OFERTA DUPLA MOBILE */}
                      <section className="py-6 px-3">
                        <div className="space-y-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-900 text-[9px] font-black uppercase">
                            ESCOLHA SEU KIT
                          </span>
                          <h4 className="text-sm font-black">Selecione o plano ideal:</h4>

                          {/* Kit Básico Mobile */}
                          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-left space-y-2">
                            <span className="text-[9px] font-bold uppercase text-zinc-500">Opção Simples</span>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-black">{basicPlanTitle}</h5>
                              <span className="text-base font-black text-zinc-700 dark:text-zinc-300">{basicPlanPrice}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (interceptUpsell) {
                                  setIsUpsellModalOpen(true);
                                } else {
                                  window.open(basicCheckoutUrl, "_blank");
                                }
                              }}
                              className="w-full text-[10px] font-bold border-zinc-300 h-8 cursor-pointer"
                            >
                              {basicPlanCta}
                            </Button>
                          </div>

                          {/* Kit Completo VIP Mobile */}
                          <div className="p-3.5 rounded-2xl border-2 border-red-600 bg-gradient-to-b from-red-50/50 to-white dark:from-red-950/20 dark:to-zinc-900 text-left space-y-2.5 relative shadow-md">
                            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[8px] uppercase">
                              MAIS VENDIDO
                            </span>
                            <span className="text-[9px] font-bold uppercase text-red-600">Completo + Bônus</span>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-black text-zinc-950 dark:text-white">{premiumPlanTitle}</h5>
                              <span className="text-xl font-black text-red-600">{premiumPlanPrice}</span>
                            </div>
                            <ul className="text-[10px] space-y-1 text-zinc-700 dark:text-zinc-300 font-medium">
                              <li className="flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 font-bold" />
                                +200 Atividades em PDF
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 font-bold" />
                                Todos os 3 Bônus Liberados
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-emerald-600 shrink-0 font-bold" />
                                Acesso Vitalício
                              </li>
                            </ul>
                            <Button
                              size="sm"
                              onClick={() => window.open(premiumCheckoutUrl, "_blank")}
                              className="w-full text-xs font-black uppercase py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-700 text-white rounded-xl shadow-md shadow-red-600/40 cursor-pointer animate-pulse"
                            >
                              {premiumPlanCta}
                            </Button>
                          </div>
                        </div>
                      </section>

                      {/* FAQ ACCORDION MOBILE */}
                      <section className="py-5 px-3 border-t border-zinc-200 dark:border-zinc-800 text-left">
                        <h4 className="text-xs font-black text-center mb-2">Dúvidas Frequentes</h4>
                        <Accordion defaultValue={["f1"]} className="space-y-1.5">
                          {faqs.slice(0, 3).map((f) => (
                            <AccordionItem key={f.id} value={f.id} className="border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg">
                              <AccordionTrigger className="text-[10px] font-bold p-2 text-zinc-800 dark:text-zinc-200">
                                {f.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-[9px] text-zinc-600 dark:text-zinc-400 p-2 pt-0 leading-relaxed">
                                {f.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </section>

                      {/* Footer Mobile */}
                      <footer className="py-4 px-3 text-center text-[9px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
                        <p>© {new Date().getFullYear()} {logoName}. Todos os direitos reservados.</p>
                      </footer>
                    </div>

                    {/* iOS Bottom Home Indicator Bar */}
                    <div className="h-4 bg-zinc-950 flex items-center justify-center shrink-0 z-20">
                      <div className="w-32 h-1 rounded-full bg-zinc-400/50" />
                    </div>
                  </div>
                </div>
              ) : (
                /* DESKTOP FULL WIDTH PREVIEW */
                <div
                  className={`w-full max-w-4xl rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden transition-all duration-300 ${
                    previewTheme === "pastel"
                      ? "bg-gradient-to-b from-[#fdfbf7] via-[#f7fdf9] to-[#fffaf5] text-zinc-900"
                      : "bg-zinc-950 text-zinc-100"
                  }`}
                >
                  {/* Faixa de Urgência Topo */}
                  <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2 px-4 text-center text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-md">
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                    <span>Aproveite o preço promocional por tempo limitado - Apenas hoje!</span>
                    <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-yellow-300 font-bold ml-1">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>

                  {/* Header da Landing Page */}
                  <header
                    className={`py-3 px-6 flex items-center justify-between border-b ${
                      previewTheme === "pastel"
                        ? "bg-white/70 border-zinc-200/70 backdrop-blur-sm"
                        : "bg-zinc-950/80 border-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-red-600 flex items-center justify-center text-[10px] text-white font-black">
                        ★
                      </span>
                      <span className={`font-black text-sm tracking-tight ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                        {logoName || "FLUXO OFFER"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Compra 100% Segura</span>
                    </div>
                  </header>

                  {/* HERO SECTION DESKTOP */}
                  <section className="p-8 md:p-10 space-y-6 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-zinc-900 text-[11px] font-black uppercase tracking-wider shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {badgeHero}
                    </div>

                    <h2
                      className={`text-2xl md:text-4xl font-black tracking-tight leading-tight ${
                        previewTheme === "pastel" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      {headline}
                    </h2>

                    <p
                      className={`text-xs md:text-sm leading-relaxed max-w-xl mx-auto ${
                        previewTheme === "pastel" ? "text-zinc-700" : "text-zinc-300"
                      }`}
                    >
                      {subheadline}
                    </p>

                    {/* MOCKUP 3D DESKTOP */}
                    {mediaType === "mockup" ? (
                      <div className="relative my-4 p-4 rounded-3xl bg-gradient-to-b from-amber-100/60 to-orange-100/40 border-2 border-dashed border-amber-300/80 shadow-2xl max-w-lg mx-auto">
                        <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-lg border border-zinc-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex flex-col items-center justify-center text-center">
                              <span className="text-3xl mb-1">🎡</span>
                              <span className="text-xs font-black text-zinc-800">Roda das Cores</span>
                              <span className="text-[10px] text-zinc-500">+30 Vocabulários</span>
                            </div>
                            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 flex flex-col items-center justify-center text-center">
                              <span className="text-3xl mb-1">🦁</span>
                              <span className="text-xs font-black text-zinc-800">Flashcards Animais</span>
                              <span className="text-[10px] text-zinc-500">Desenhos & Pronúncia</span>
                            </div>
                            <div className="rounded-xl border border-pink-200 bg-pink-50 p-3 flex flex-col items-center justify-center text-center">
                              <span className="text-3xl mb-1">🍕</span>
                              <span className="text-xs font-black text-zinc-800">Pizza de Frutas</span>
                              <span className="text-[10px] text-zinc-500">Atividades Interativas</span>
                            </div>
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex flex-col items-center justify-center text-center">
                              <span className="text-3xl mb-1">🏆</span>
                              <span className="text-xs font-black text-zinc-800">Certificado Bilíngue</span>
                              <span className="text-[10px] text-zinc-500">Pronto para Imprimir</span>
                            </div>
                          </div>

                          <div className="mt-2 py-1.5 px-3 rounded-lg bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md">
                            <span>📦 +200 ATIVIDADES EM PDF PRONTAS PARA IMPRIMIR</span>
                          </div>
                        </div>

                        <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2.5 font-black text-[10px] shadow-lg shadow-red-500/50 rotate-12">
                          80% OFF
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl aspect-video max-w-xl mx-auto">
                        {videoId ? (
                          <iframe
                            className="w-full h-full pointer-events-none"
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0`}
                            title="VSL Player"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                            Insira um ID de vídeo válido na aba Seções
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botão CTA Hero */}
                    <div className="pt-2 max-w-md mx-auto space-y-2">
                      <Button
                        size="lg"
                        onClick={() => {
                          if (interceptUpsell) {
                            setIsUpsellModalOpen(true);
                          } else {
                            window.open(premiumCheckoutUrl, "_blank");
                          }
                        }}
                        className="w-full py-6 text-sm md:text-base font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-2xl shadow-xl shadow-red-600/40 animate-pulse border border-red-400/40 cursor-pointer"
                      >
                        {ctaText}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                      <p className={`text-xs font-semibold ${previewTheme === "pastel" ? "text-zinc-600" : "text-zinc-400"}`}>
                        {socialProofText}
                      </p>
                    </div>
                  </section>

                  {/* CARROSSEL DESKTOP */}
                  <section
                    className={`py-8 px-6 border-t ${
                      previewTheme === "pastel" ? "bg-white/60 border-zinc-200" : "bg-zinc-900/40 border-zinc-900"
                    }`}
                  >
                    <div className="max-w-3xl mx-auto space-y-5 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-900">
                          RECURSOS
                        </span>
                        <h3 className={`text-xl md:text-2xl font-black ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                          Veja alguns dos recursos do kit
                        </h3>
                      </div>

                      <div className="relative max-w-xl mx-auto">
                        <div
                          className={`p-6 rounded-3xl border-2 transition-all shadow-xl text-left flex items-center gap-6 ${
                            previewTheme === "pastel" ? "bg-white border-zinc-200" : "bg-zinc-950 border-zinc-800"
                          }`}
                        >
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${resources[currentSlide].iconBg} flex items-center justify-center text-4xl shadow-md shrink-0`}
                          >
                            {resources[currentSlide].emoji}
                          </div>
                          <div className="space-y-1 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-600">
                              {resources[currentSlide].tag}
                            </span>
                            <h4 className={`text-base font-black ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                              {resources[currentSlide].title}
                            </h4>
                            <p className={`text-xs leading-relaxed ${previewTheme === "pastel" ? "text-zinc-600" : "text-zinc-400"}`}>
                              {resources[currentSlide].description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : resources.length - 1))}
                          className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentSlide((prev) => (prev < resources.length - 1 ? prev + 1 : 0))}
                          className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* TABELA DUPLA DESKTOP */}
                  <section className="py-10 px-6">
                    <div className="max-w-2xl mx-auto space-y-6 text-center">
                      <div className="space-y-1">
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-zinc-900 text-[10px] font-black uppercase">
                          OFERTA ÚNICA
                        </span>
                        <h3 className={`text-2xl font-black ${previewTheme === "pastel" ? "text-zinc-900" : "text-white"}`}>
                          Escolha seu kit
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left">
                        {/* Básico */}
                        <div className={`p-5 rounded-3xl border space-y-4 ${previewTheme === "pastel" ? "bg-white border-zinc-200" : "bg-zinc-900 border-zinc-800"}`}>
                          <span className="text-[10px] font-bold uppercase text-zinc-500">Opção Simples</span>
                          <h4 className="text-base font-black">{basicPlanTitle}</h4>
                          <div className="text-2xl font-black text-zinc-700">{basicPlanPrice}</div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (interceptUpsell) {
                                setIsUpsellModalOpen(true);
                              } else {
                                window.open(basicCheckoutUrl, "_blank");
                              }
                            }}
                            className="w-full text-xs font-bold border-zinc-300 cursor-pointer"
                          >
                            {basicPlanCta}
                          </Button>
                        </div>

                        {/* Completo VIP */}
                        <div className="p-5 rounded-3xl border-2 border-red-600 bg-gradient-to-b from-red-50/40 to-white space-y-4 relative shadow-xl shadow-red-500/10">
                          <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase">
                            MAIS VENDIDO
                          </span>
                          <span className="text-[10px] font-bold uppercase text-red-600">Completo + Bônus</span>
                          <h4 className="text-base font-black text-zinc-950">{premiumPlanTitle}</h4>
                          <div className="text-3xl font-black text-red-600">{premiumPlanPrice}</div>
                          <Button
                            onClick={() => window.open(premiumCheckoutUrl, "_blank")}
                            className="w-full text-xs font-black uppercase py-5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-lg shadow-red-600/40 cursor-pointer animate-pulse"
                          >
                            {premiumPlanCta}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* --- DIALOG SHADCN: MODAL DE UPSELL INTERCEPTADO --- */}
      <Dialog open={isUpsellModalOpen} onOpenChange={setIsUpsellModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-2 border-red-600 bg-zinc-950 shadow-2xl shadow-red-950/80 rounded-2xl">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white p-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 text-[10px] font-black uppercase tracking-wider text-yellow-300">
              <AlertTriangle className="h-3 w-3" />
              Aguarde! Não feche esta janela
            </div>
            <DialogTitle className="text-lg md:text-xl font-black text-white leading-tight">
              VOCÊ DESBLOQUEOU UM UPGRADE EXCLUSIVO
            </DialogTitle>
            <DialogDescription className="text-xs text-red-100 font-medium">
              Válido somente para os próximos 3 minutos antes do checkout
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-medium">
              {upsellCopy}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1 opacity-70">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Plano Selecionado
                </span>
                <div className="text-sm font-bold text-zinc-300">{basicPlanTitle}</div>
                <div className="text-base font-black text-zinc-400">{basicPlanPrice}</div>
                <p className="text-[10px] text-zinc-500">Sem os bônus e complementos</p>
              </div>

              <div className="p-3 rounded-xl border-2 border-red-600 bg-red-950/20 space-y-1 relative">
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                  Melhor Escolha
                </span>
                <span className="text-[10px] uppercase font-bold text-red-400">
                  {premiumPlanTitle}
                </span>
                <div className="text-sm font-bold text-white">Todos os +200 Recursos & Bônus</div>
                <div className="text-base font-black text-red-400">{premiumPlanPrice}</div>
                <p className="text-[10px] text-zinc-300">Acesso vitalício e suporte prioritário</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  window.open(premiumCheckoutUrl, "_blank");
                  setIsUpsellModalOpen(false);
                }}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/50 hover:shadow-red-500/70 border border-red-400 cursor-pointer"
              >
                🔥 Sim! Quero Adicionar ao Meu Pedido
              </Button>

              <button
                type="button"
                onClick={() => {
                  window.open(basicCheckoutUrl, "_blank");
                  setIsUpsellModalOpen(false);
                }}
                className="w-full text-center text-xs text-zinc-400 hover:text-zinc-200 py-1 underline cursor-pointer"
              >
                Não, prefiro continuar apenas com o plano básico e perder essa oportunidade
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
