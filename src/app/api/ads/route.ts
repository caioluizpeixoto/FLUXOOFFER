import { NextRequest, NextResponse } from "next/server";
import { getAllOffers, saveOffer } from "@/lib/offers-store";
import { validateApiKey } from "@/lib/api-keys-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const folder = searchParams.get("folder");
    const niche = searchParams.get("niche");
    const status = searchParams.get("status");
    const miner = searchParams.get("miner");

    let offers = await getAllOffers();

    if (search) {
      offers = offers.filter(
        (o) =>
          o.advertiserName?.toLowerCase().includes(search) ||
          o.copy?.toLowerCase().includes(search) ||
          o.notes?.toLowerCase().includes(search) ||
          o.savedBy?.toLowerCase().includes(search) ||
          o.tags?.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (folder && folder !== "Todas") {
      offers = offers.filter((o) => o.folder === folder);
    }

    if (niche && niche !== "Todos") {
      offers = offers.filter((o) => o.niche === niche);
    }

    if (status && status !== "todos") {
      offers = offers.filter((o) => o.statusWhenSaved === status);
    }

    if (miner && miner !== "Todos") {
      offers = offers.filter((o) => o.savedBy === miner);
    }

    return NextResponse.json(
      { success: true, count: offers.length, data: offers },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao listar ofertas:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao buscar ofertas" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || (!body.advertiserName && !body.metaAdId && !body.copy)) {
      return NextResponse.json(
        { success: false, message: "Dados do anúncio incompletos." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Identifica quem enviou a oferta (Chave de API ou Nome)
    let savedBy = "Caio (Admin)";
    let savedByEmail = "";

    const authHeader = request.headers.get("Authorization");
    const rawKey = authHeader || body.apiKey;

    if (rawKey) {
      const validatedUser = await validateApiKey(rawKey);
      if (validatedUser) {
        savedBy = validatedUser.userName;
        savedByEmail = validatedUser.userEmail || "";
      }
    } else if (body.savedBy) {
      savedBy = body.savedBy;
    }

    const saved = await saveOffer({
      ...body,
      savedBy,
      savedByEmail,
      apiKey: rawKey ? rawKey.replace(/^Bearer\s+/i, "").trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        ad: saved,
        savedBy,
        message: `Anúncio salvo com sucesso no Cofre por ${savedBy}!`,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao salvar anúncio:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar e salvar anúncio." },
      { status: 500, headers: corsHeaders }
    );
  }
}
