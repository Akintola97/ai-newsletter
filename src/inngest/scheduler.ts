// src/inngest/scheduler.ts
import { inngest } from "./client";
import { prisma } from "@/lib/prisma";

/**
 * Runs on a cron to enqueue newsletter jobs for users who are "due".
 * Strategy:
 *  1) Find preferences that are due (not paused and nextSendAt <= now OR null).
 *  2) Lock each row by bumping nextSendAt slightly into the future (LOCK_AHEAD_MINUTES),
 *     so overlapping cron runs won't enqueue duplicates.
 *  3) Enqueue an Inngest event per locked user.
 *
 * After the newsletter send actually completes, your newsletter function
 * updates lastSentAt and computes the real nextSendAt based on frequency.
 */

const CRON = "5 * * * *"; // every hour at minute 5 — adjust as needed
const BATCH_SIZE = 500; // process in chunks to avoid huge fan-out
const LOCK_AHEAD_MINUTES = 10; // minimal lock to avoid double enqueue during overlap

export default inngest.createFunction(
  { id: "newsletter-scheduler" },
  { cron: CRON },
  async ({ step }) => {
    const now = new Date();

    while (true) {
      const due = await step.run(
        "find-due-preferences",
        () =>
          prisma.preference.findMany({
            where: {
              paused: false,
              OR: [{ nextSendAt: { lte: now } }, { nextSendAt: null }],
            },
            select: { userId: true, nextSendAt: true },
            take: BATCH_SIZE,
          })
      ) as Array<{ userId: string; nextSendAt: Date | null }>;

      if (!due.length) {
        await step.run("log-no-due", async () => {
          console.log("[scheduler] No due preferences found.");
        });
        break;
      }

      // Try to "lock" each user by safely bumping nextSendAt a few minutes ahead
      // ONLY if they're still due at the moment of update (prevents race conditions).
      const lockUntil = new Date(now.getTime() + LOCK_AHEAD_MINUTES * 60_000);

      const lockedUserIds: string[] = [];
      for (const p of due) {
        const updated = await step.run(`lock-${p.userId}`, () =>
          prisma.preference.updateMany({
            where: {
              userId: p.userId,
              paused: false,
              OR: [{ nextSendAt: { lte: now } }, { nextSendAt: null }],
            },
            data: { nextSendAt: lockUntil },
          })
        );

        // updateMany returns { count }; count===1 means we won the lock for this user
        if ((updated as { count: number }).count === 1) {
          lockedUserIds.push(p.userId);
        }
      }

      if (!lockedUserIds.length) {
        await step.run("log-nothing-locked", async () => {
          console.log("[scheduler] Found due rows but none locked (likely races).");
        });
        // Continue loop to try next batch
        continue;
      }

      // Fan-out events for the locked users
      await step.run("enqueue-events", async () => {
        await Promise.all(
          lockedUserIds.map((userId) =>
            inngest.send({
              name: "scheduled.newsletter",
              data: { userId },
            })
          )
        );
        console.log("[scheduler] Enqueued newsletters for users:", lockedUserIds.length);
      });

      // If the batch was full, loop again to catch more; otherwise exit.
      if (due.length < BATCH_SIZE) break;
    }
  }
);
