// app/api/inngest/invoke/route.ts
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const u = await getUser();
  if (!u?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const topicsInline = typeof body.topics === "string" ? body.topics : "";

  await inngest.send({
    name: "scheduled.newsletter",
    data: {
      kindeId: u.id,
      topicsInline, // <- pass raw input straight through to Inngest
    },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
