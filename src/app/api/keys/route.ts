import { NextRequest, NextResponse } from "next/server";
import {
  getAllApiKeys,
  createApiKey,
  deleteApiKey,
  validateApiKey,
} from "@/lib/api-keys-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const keys = await getAllApiKeys();
    return NextResponse.json(
      { success: true, count: keys.length, data: keys },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao listar chaves:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar chaves de API." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Se for validação rápida vinda da extensão:
    if (body.action === "validate") {
      const user = await validateApiKey(body.key);
      if (!user) {
        return NextResponse.json(
          { success: false, valid: false, message: "Chave de API inválida ou revogada." },
          { status: 401, headers: corsHeaders }
        );
      }
      return NextResponse.json(
        {
          success: true,
          valid: true,
          user: {
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
          },
        },
        { headers: corsHeaders }
      );
    }

    // Criação de nova chave
    if (!body.userName || body.userName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Nome do membro é obrigatório." },
        { status: 400, headers: corsHeaders }
      );
    }

    const newKey = await createApiKey(
      body.userName.trim(),
      body.userEmail?.trim(),
      body.role || "miner"
    );

    return NextResponse.json(
      {
        success: true,
        key: newKey,
        message: "Chave de API gerada com sucesso!",
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao processar chave:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao criar chave de API." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Chave não informada." },
        { status: 400, headers: corsHeaders }
      );
    }

    const ok = await deleteApiKey(key);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Chave não encontrada." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Chave de API revogada com sucesso." },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao revogar chave:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao revogar chave." },
      { status: 500, headers: corsHeaders }
    );
  }
}
