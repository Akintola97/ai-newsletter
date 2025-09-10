// // // app/api/preferences/route.js
// // export const runtime = "nodejs";
// // export const revalidate = 0;

// // import { NextResponse } from "next/server";
// // import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// // import { prisma } from "@/lib/prisma";
// // import { inngest } from "@/inngest/client";

// // const FREQS = new Set(["DAILY", "BIWEEKLY", "MONTHLY"]);

// // function sanitizeTopics(input) {
// //   if (typeof input !== "string") return null;
// //   const list = Array.from(
// //     new Set(
// //       input
// //         .split(",")
// //         .map((t) => t.trim())
// //         .filter(Boolean)
// //     )
// //   );
// //   const joined = list.join(", ");
// //   return joined.slice(0, 600);
// // }

// // export async function GET() {
// //   try {
// //     const { getUser } = getKindeServerSession();
// //     const u = await getUser();
// //     if (!u?.id) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const user = await prisma.user.findUnique({
// //       where: { kindeId: u.id },
// //       include: { preferences: true }, // switch to { preference: true } if your field is singular
// //     });

// //     return NextResponse.json({ preference: user?.preferences ?? null }, { status: 200 });
// //   } catch {
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }

// // export async function POST(req) {
// //   try {
// //     const { getUser } = getKindeServerSession();
// //     const u = await getUser();
// //     if (!u?.id) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const body = await req.json().catch(() => ({}));

// //     const next = {};
// //     if (body.frequency !== undefined) {
// //       const freq = String(body.frequency).toUpperCase();
// //       next.frequency = FREQS.has(freq) ? freq : "DAILY";
// //     }
// //     if (body.topics !== undefined) {
// //       next.topics = sanitizeTopics(body.topics);
// //     }
// //     if (typeof body.paused === "boolean") {
// //       next.paused = body.paused;
// //     }

// //     if (Object.keys(next).length === 0) {
// //       return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
// //     }

// //     const user = await prisma.user.findUnique({
// //       where: { kindeId: u.id },
// //       select: { id: true },
// //     });
// //     if (!user) {
// //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// //     }

// //     const pref = await prisma.preference.upsert({
// //       where: { userId: user.id },
// //       update: next,
// //       create: {
// //         userId: user.id,
// //         frequency: next.frequency ?? "DAILY",
// //         topics: next.topics ?? null,
// //         paused: next.paused ?? false,
// //       },
// //     });

// //     // 🔔 Enqueue newsletter non-blocking & report status
// //     let enqueued = false;
// //     let eventId = null;

// //     if (!pref.paused) {
// //       try {
// //         const sent = await inngest.send({
// //           name: "scheduled.newsletter",
// //           data: { userId: user.id },
// //         });
// //         eventId = (sent && (sent.ids?.[0] || sent.id)) || null;
// //         enqueued = true;
// //       } catch (err) {
// //         console.error("[/api/preferences] inngest.send failed:", err?.message || err);
// //         // Do not throw—saving preferences should still succeed
// //       }
// //     }

// //     return NextResponse.json({ preference: pref, enqueued, eventId }, { status: 200 });
// //   } catch (e) {
// //     console.error(e);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }






// export const runtime = "nodejs";
// export const revalidate = 0;

// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { prisma } from "@/lib/prisma";
// import { nextSendAtFrom } from "@/lib/frequency";

// const FREQS = new Set(["DAILY", "BIWEEKLY", "MONTHLY"]);

// function sanitizeTopics(input) {
//   if (typeof input !== "string") return null;
//   const list = Array.from(
//     new Set(
//       input
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean)
//     )
//   );
//   const joined = list.join(", ");
//   return joined.slice(0, 600);
// }

// export async function GET() {
//   try {
//     const { getUser } = getKindeServerSession();
//     const u = await getUser();
//     if (!u?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

//     const existing = await prisma.user.findUnique({
//       where: { kindeId: u.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         preferences: {
//           select: { frequency: true, topics: true, paused: true, lastSentAt: true, nextSendAt: true },
//         },
//       },
//     });

//     return NextResponse.json({ ok: true, user: existing }, { status: 200 });
//   } catch (e) {
//     console.error("[preferences.GET] error", e);
//     return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const { getUser } = getKindeServerSession();
//     const u = await getUser();
//     if (!u?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

//     const body = await req.json().catch(() => ({}));
//     const frequency = FREQS.has(body.frequency) ? body.frequency : "DAILY";
//     const topics = sanitizeTopics(body.topics);
//     const paused = Boolean(body.paused);

//     // Ensure local user exists
//     let user = await prisma.user.findUnique({ where: { kindeId: u.id } });
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           kindeId: u.id,
//           email: u.email ?? "",
//           name: u.given_name || u.family_name ? `${u.given_name ?? ""} ${u.family_name ?? ""}`.trim() : null,
//         },
//       });
//     }

//     // Upsert preferences & initialize nextSendAt if missing
//     const pref = await prisma.preference.upsert({
//       where: { userId: user.id },
//       update: {
//         frequency,
//         topics,
//         paused,
//         // If nextSendAt is null or frequency changed, re-initialize
//         ...(body._forceInit === true ? { nextSendAt: nextSendAtFrom(frequency) } : {}),
//       },
//       create: {
//         userId: user.id,
//         frequency,
//         topics,
//         paused,
//         nextSendAt: nextSendAtFrom(frequency), // first-time init
//       },
//       select: { frequency: true, topics: true, paused: true, nextSendAt: true },
//     });

//     // If not forcing, still ensure nextSendAt is present
//     if (!pref.nextSendAt && !paused) {
//       await prisma.preference.update({
//         where: { userId: user.id },
//         data: { nextSendAt: nextSendAtFrom(frequency) },
//       });
//     }

//     return NextResponse.json({ ok: true }, { status: 200 });
//   } catch (e) {
//     console.error("[preferences.POST] error", e);
//     return NextResponse.json({ ok: false, error: "Failed to save preferences" }, { status: 500 });
//   }
// }




// app/api/preferences/route.js
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { nextSendAtFrom } from "@/lib/frequency";
import { inngest } from "@/inngest/client"; // ⬅️ import your Inngest client

const FREQS = new Set(["DAILY", "BIWEEKLY", "MONTHLY"]);

function sanitizeTopics(input) {
  if (typeof input !== "string") return null;
  const list = Array.from(
    new Set(
      input
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );
  const joined = list.join(", ");
  return joined.slice(0, 600);
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const u = await getUser();
    if (!u?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.user.findUnique({
      where: { kindeId: u.id },
      select: {
        id: true,
        email: true,
        name: true,
        preferences: {
          select: { frequency: true, topics: true, paused: true, lastSentAt: true, nextSendAt: true },
        },
      },
    });

    // for your client code that expects json.preference
    return NextResponse.json({ ok: true, preference: existing?.preferences ?? null }, { status: 200 });
  } catch (e) {
    console.error("[preferences.GET] error", e);
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { getUser } = getKindeServerSession();
    const u = await getUser();
    if (!u?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const frequency = FREQS.has(body.frequency) ? body.frequency : "DAILY";
    const topics = sanitizeTopics(body.topics);
    const paused = Boolean(body.paused);

    // Ensure local user exists
    let user = await prisma.user.findUnique({ where: { kindeId: u.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          kindeId: u.id,
          email: u.email ?? "",
          name: u.given_name || u.family_name ? `${u.given_name ?? ""} ${u.family_name ?? ""}`.trim() : null,
        },
      });
    }

    // Upsert preferences & initialize nextSendAt if missing
    const pref = await prisma.preference.upsert({
      where: { userId: user.id },
      update: {
        frequency,
        topics,
        paused,
        ...(body._forceInit === true ? { nextSendAt: nextSendAtFrom(frequency) } : {}),
      },
      create: {
        userId: user.id,
        frequency,
        topics,
        paused,
        nextSendAt: nextSendAtFrom(frequency),
      },
      select: { frequency: true, topics: true, paused: true, nextSendAt: true },
    });

    if (!pref.nextSendAt && !paused) {
      await prisma.preference.update({
        where: { userId: user.id },
        data: { nextSendAt: nextSendAtFrom(frequency) },
      });
    }

    // 🔔 Enqueue a one-off newsletter run (only if not paused)
    let enqueued = false;
    let eventId = null;
    if (!paused) {
      try {
        const sent = await inngest.send({
          name: "scheduled.newsletter",
          data: { userId: user.id, topicsInline: topics ?? "" }, // you can also pass kindeId: u.id
        });
        eventId = (sent && sent.ids?.[0]) || null;
        enqueued = Boolean(eventId);
      } catch (err) {
        console.error("[preferences.POST] inngest.send failed:", err?.message || err);
      }
    }

    return NextResponse.json({ ok: true, enqueued, eventId }, { status: 200 });
  } catch (e) {
    console.error("[preferences.POST] error", e);
    return NextResponse.json({ ok: false, error: "Failed to save preferences" }, { status: 500 });
  }
}