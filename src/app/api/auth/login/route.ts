import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const masterEmail = "caioluispeixotos@gmail.com";
    const masterPassword = "Kkaioluis1!";

    if (email === masterEmail && password === masterPassword) {
      // Usar a forma correta para cookies assíncronos no Next.js
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
