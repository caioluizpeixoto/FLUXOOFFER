import { NextRequest, NextResponse } from "next/server";
import { deleteOffer, updateOffer } from "@/lib/offers-store";

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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await deleteOffer(id);

    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Anúncio não encontrado." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Anúncio excluído com sucesso do Cofre." },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao excluir anúncio:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao excluir anúncio." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateOffer(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Anúncio não encontrado para atualização." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, ad: updated, message: "Anúncio atualizado com sucesso." },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao atualizar anúncio." },
      { status: 500, headers: corsHeaders }
    );
  }
}
