import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email("E-mail invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  storeName: z.string().min(1, "Nom du magasin requis"),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bodySchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet e-mail." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: {
          create: {
            storeName: data.storeName,
            phone: data.phone ?? undefined,
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        storeName: user.profile?.storeName,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'inscription." },
      { status: 500 }
    );
  }
}
