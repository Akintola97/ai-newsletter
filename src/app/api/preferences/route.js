// // // // app/api/preferences/route.js
// // // export const runtime = "nodejs";
// // // export const revalidate = 0;

// // // import { NextResponse } from "next/server";
// // // import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// // // import { prisma } from "@/lib/prisma";

// // // export async function GET() {
// // //   try {
// // //     const { getUser } = getKindeServerSession();
// // //     const u = await getUser();
// // //     if (!u?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// // //     const user = await prisma.user.findUnique({
// // //       where: { kindeId: u.id },
// // //       include: { preferences: true },
// // //     });

// // //     return NextResponse.json({ preference: user?.preferences ?? null }, { status: 200 });
// // //   } catch {
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }

// // // export async function POST(req) {
// // //   try {
// // //     const { getUser } = getKindeServerSession();
// // //     const u = await getUser();
// // //     if (!u?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// // //     const body = await req.json();
// // //     const {
// // //       frequency = "DAILY",
// // //       topics = null,
// // //       paused, // <- boolean (optional)
// // //     } = body;

// // //     const user = await prisma.user.findUnique({ where: { kindeId: u.id } });
// // //     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

// // //     const data = { frequency, topics };
// // //     if (typeof paused === "boolean") data.paused = paused;

// // //     const pref = await prisma.preference.upsert({
// // //       where: { userId: user.id },
// // //       update: data,
// // //       create: { userId: user.id, ...data },
// // //     });

// // //     return NextResponse.json({ preference: pref }, { status: 200 });
// // //   } catch {
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }




// // // app/api/preferences/route.js
// // export const runtime = "nodejs";
// // export const revalidate = 0;

// // import { NextResponse } from "next/server";
// // import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// // import { prisma } from "@/lib/prisma";

// // const FREQS = new Set(["DAILY", "BIWEEKLY", "MONTHLY"]);

// // function sanitizeTopics(input) {
// //   if (typeof input !== "string") return null;
// //   // split, trim, remove empties, dedupe, rejoin (preserve user words/casing)
// //   const list = Array.from(
// //     new Set(
// //       input
// //         .split(",")
// //         .map((t) => t.trim())
// //         .filter(Boolean)
// //     )
// //   );
// //   // clamp to avoid absurdly long strings (email safety)
// //   const joined = list.join(", ");
// //   return joined.slice(0, 600); // ~600 chars total
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
// //       // Use the relation name that matches your Prisma schema:
// //       include: { preferences: true }, // or { preference: true } if singular
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

// //     // Allow partial updates:
// //     const next = {};

// //     // frequency (optional)
// //     if (body.frequency !== undefined) {
// //       const freq = String(body.frequency).toUpperCase();
// //       next.frequency = FREQS.has(freq) ? freq : "DAILY";
// //     }

// //     // topics (optional)
// //     if (body.topics !== undefined) {
// //       next.topics = sanitizeTopics(body.topics);
// //     }

// //     // paused (optional boolean)
// //     if (typeof body.paused === "boolean") {
// //       next.paused = body.paused;
// //     }

// //     // If client didn’t send any known fields, default to no-op
// //     if (Object.keys(next).length === 0) {
// //       return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
// //     }

// //     const user = await prisma.user.findUnique({ where: { kindeId: u.id } });
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

// //     return NextResponse.json({ preference: pref }, { status: 200 });
// //   } catch {
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }




// // app/api/preferences/route.js
// export const runtime = "nodejs";
// export const revalidate = 0;

// import { NextResponse } from "next/server";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { prisma } from "@/lib/prisma";
// import { inngest } from "@/inngest/client";

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
//     if (!u?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { kindeId: u.id },
//       include: { preferences: true }, // or { preference: true } per your schema
//     });

//     return NextResponse.json({ preference: user?.preferences ?? null }, { status: 200 });
//   } catch {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const { getUser } = getKindeServerSession();
//     const u = await getUser();
//     if (!u?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json().catch(() => ({}));

//     const next = {};
//     if (body.frequency !== undefined) {
//       const freq = String(body.frequency).toUpperCase();
//       next.frequency = FREQS.has(freq) ? freq : "DAILY";
//     }
//     if (body.topics !== undefined) {
//       next.topics = sanitizeTopics(body.topics);
//     }
//     if (typeof body.paused === "boolean") {
//       next.paused = body.paused;
//     }

//     if (Object.keys(next).length === 0) {
//       return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({ where: { kindeId: u.id }, select: { id: true } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const pref = await prisma.preference.upsert({
//       where: { userId: user.id },
//       update: next,
//       create: {
//         userId: user.id,
//         frequency: next.frequency ?? "DAILY",
//         topics: next.topics ?? null,
//         paused: next.paused ?? false,
//       },
//     });

//     // 🔔 Trigger the newsletter in the background (server-side only)
//     // Only fire when not paused
//     if (!pref.paused) {
//       // Optional: add an idempotency key to reduce accidental dupes
//       await inngest.send({
//         name: "scheduled.newsletter",
//         data: { userId: user.id },
//       });
//     }

//     return NextResponse.json({ preference: pref }, { status: 200 });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



// app/api/preferences/route.js
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

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
    if (!u?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { kindeId: u.id },
      include: { preferences: true }, // switch to { preference: true } if your field is singular
    });

    return NextResponse.json({ preference: user?.preferences ?? null }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { getUser } = getKindeServerSession();
    const u = await getUser();
    if (!u?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const next = {};
    if (body.frequency !== undefined) {
      const freq = String(body.frequency).toUpperCase();
      next.frequency = FREQS.has(freq) ? freq : "DAILY";
    }
    if (body.topics !== undefined) {
      next.topics = sanitizeTopics(body.topics);
    }
    if (typeof body.paused === "boolean") {
      next.paused = body.paused;
    }

    if (Object.keys(next).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { kindeId: u.id },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pref = await prisma.preference.upsert({
      where: { userId: user.id },
      update: next,
      create: {
        userId: user.id,
        frequency: next.frequency ?? "DAILY",
        topics: next.topics ?? null,
        paused: next.paused ?? false,
      },
    });

    // 🔔 Enqueue newsletter non-blocking & report status
    let enqueued = false;
    let eventId = null;

    if (!pref.paused) {
      try {
        const sent = await inngest.send({
          name: "scheduled.newsletter",
          data: { userId: user.id },
        });
        eventId = (sent && (sent.ids?.[0] || sent.id)) || null;
        enqueued = true;
      } catch (err) {
        console.error("[/api/preferences] inngest.send failed:", err?.message || err);
        // Do not throw—saving preferences should still succeed
      }
    }

    return NextResponse.json({ preference: pref, enqueued, eventId }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}