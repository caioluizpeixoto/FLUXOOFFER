"use client";

import Link from "next/link";
import { Home, Layers, Video, FileText, Download, Quote, Settings, Flame } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Page Builder (Novo)",
    url: "/tools/page-builder",
    icon: Flame,
  },
  {
    title: "Baixador de Páginas",
    url: "/tools/page-downloader",
    icon: Download,
  },
  {
    title: "Transcritor VSL",
    url: "/tools/vsl-transcriber",
    icon: Video,
  },
  {
    title: "Cofre de Ofertas",
    url: "/tools/swipe-file",
    icon: Layers,
  },
  {
    title: "Gerador de Copy",
    url: "/tools/copy-generator",
    icon: FileText,
  },
  {
    title: "Gerador de Depoimentos",
    url: "/tools/testimonial-generator",
    icon: Quote,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          F
        </div>
        <span className="font-bold text-lg tracking-tight">FluxoOffer</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Meu Perfil</span>
            <span className="text-xs text-muted-foreground">Produtor</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
