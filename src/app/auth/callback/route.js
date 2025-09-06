import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const { getUser } = getKindeServerSession();
  const u = await getUser();
  if (u && u.id) {
    const email = u.email?.toLowerCase();
    await prisma.user.upsert({
      where: { kindeId: u.id },
      update: { email, name: u.given_name ? `${u.given_name} ${u.family_name ?? ""}`.trim() : u.email },
      create: { kindeId: u.id, email, name: u.given_name ? `${u.given_name} ${u.family_name ?? ""}`.trim() : u.email },
    });
  }
  return NextResponse.redirect(new URL("/dashboard", process.env.KINDE_SITE_URL));
}
