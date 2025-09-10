// // import { inngest } from "./client";
// // import { fetchArticles } from "./functions";

// // export default inngest.createFunction(
// //   { id: "newsletter" },
// //   { event: "scheduled.newsletter" },
// //   async ({ event, step, runId }) => {
// //     const categories = ["technology", "business", "politics"];
// //     const allArticles = await step.run("fetch-news", async () => {
// //       return fetchArticles(categories);
// //     });

// //     const summary = await step.ai.infer("summarize-news", {
// //       model: step.ai.models.openai({ model: "gpt-4o" }),
// //       body: {
// //         messages: [
// //           {
// //             role: "system",
// //             content: `You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary that:
// //                     - Highlights the most important stories
// //                     - Provides context and insights
// //                     - Is well structured with clear sections
// //                     - Keeps the reader informed and engaged
// //                     Format the response as a proper newsletter with a title and organized content. Make it email-friendly with clear sections and engaging subject lines.`,
// //           },
// //           {
// //             role: "user",
// //             content: `Create a newsletter summary for the articles from the past week. Categories requested: ${categories.join(
// //               ", "
// //             )} 
                    
// //                     Articles: ${allArticles.map(
// //                       (article: any, idx) =>
// //                         `${idx + 1}.${article.title}\n ${
// //                           article.description
// //                         }\n Source:${article.url}\n`
// //                     )}
// //                     `,
// //           },
// //         ],
// //       },
// //     });
// //     console.log("news-summary",summary.choices[0].message.content);
// //   }
// // );



// // import { inngest } from "./client";
// // import { fetchArticles } from "./functions";
// // import { prisma } from "@/lib/prisma";
// // import { topicsToCategories } from "@/lib/topics";

// // type EventData = {
// //   userId?: string;   // Prisma User.id (cuid)
// //   kindeId?: string;  // Kinde auth id
// // };

// // export default inngest.createFunction(
// //   { id: "newsletter" },
// //   { event: "scheduled.newsletter" },
// //   async ({ event, step, runId }) => {
// //     const data = (event.data as EventData) || {};
// //     let internalUserId = data.userId;

// //     // If only Kinde ID is provided, resolve to internal Prisma user id
// //     if (!internalUserId && data.kindeId) {
// //       const user = await step.run("resolve-user-by-kinde", async () =>
// //         prisma.user.findUnique({
// //           where: { kindeId: data.kindeId! },
// //           select: { id: true },
// //         })
// //       );
// //       internalUserId = user?.id;
// //     }

// //     if (!internalUserId) {
// //       console.log("[newsletter] missing internal user id; ignoring", {
// //         name: event.name,
// //         dataKeys: Object.keys(event.data ?? {}),
// //       });
// //       return;
// //     }

// //     // Load user preference (topics + paused)
// //     const pref = await step.run("load-preferences", async () =>
// //       prisma.preference.findUnique({
// //         where: { userId: internalUserId! },
// //         select: { topics: true, paused: true },
// //       })
// //     );

// //     if (!pref) {
// //       console.log("[newsletter] no preferences for user; skipping", { internalUserId, runId });
// //       return;
// //     }
// //     if (pref.paused) {
// //       console.log("[newsletter] subscription paused; skipping", { internalUserId, runId });
// //       return;
// //     }

// //     // Derive categories from saved topics (comma-separated string)
// //     const derived = topicsToCategories(pref.topics);
// //     const categories =
// //       derived.length > 0 ? derived : ["technology", "business", "politics"]; // fallback

// //     // Fetch articles for *user-chosen* categories
// //     const allArticles = await step.run("fetch-news", async () => {
// //       return fetchArticles(categories);
// //     });

// //     // Create newsletter summary
// //     const summary = await step.ai.infer("summarize-news", {
// //       model: step.ai.models.openai({ model: "gpt-4o" }),
// //       body: {
// //         messages: [
// //           {
// //             role: "system",
// //             content: `You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary that:
// // - Highlights the most important stories
// // - Provides context and insights
// // - Is well structured with clear sections
// // - Keeps the reader informed and engaged
// // Format the response as a proper newsletter with a title and organized content. Make it email-friendly with clear sections and engaging subject lines.`,
// //           },
// //           {
// //             role: "user",
// //             content:
// //               `Create a newsletter summary for the articles from the past week.\n` +
// //               `Categories requested: ${categories.join(", ")}\n\n` +
// //               `Articles:\n` +
// //               allArticles
// //                 .map(
// //                   (article: any, idx: number) =>
// //                     `${idx + 1}. ${article.title}\n${article.description}\nSource: ${article.url}\n`
// //                 )
// //                 .join("\n"),
// //           },
// //         ],
// //       },
// //     });

// //     console.log("news-summary", summary.choices?.[0]?.message?.content);
// //   }
// // );




// // // src/inngest/newsletter.ts
// // import { inngest } from "./client";
// // import { fetchArticles } from "./functions";
// // import { prisma } from "@/lib/prisma";
// // import { topicsToCategories } from "@/lib/topics";

// // type EventData = {
// //   userId?: string;   // Prisma User.id (cuid)
// //   kindeId?: string;  // Kinde auth id (fallback if you prefer)
// // };

// // export default inngest.createFunction(
// //   { id: "newsletter" },
// //   { event: "scheduled.newsletter" },
// //   async ({ event, step, runId }) => {
// //     const data = (event.data as EventData) || {};
// //     let internalUserId = data.userId;

// //     // Optional: resolve via Kinde if only kindeId was sent
// //     if (!internalUserId && data.kindeId) {
// //       const found = await step.run("resolve-user-by-kinde", () =>
// //         prisma.user.findUnique({ where: { kindeId: data.kindeId! }, select: { id: true } })
// //       ) as { id: string } | null;
// //       internalUserId = found?.id;
// //     }

// //     if (!internalUserId) {
// //       console.log("[newsletter] missing internal user id; skipping", { runId });
// //       return;
// //     }

// //     // Load saved preferences
// //     const pref = await step.run("load-preferences", () =>
// //       prisma.preference.findUnique({
// //         where: { userId: internalUserId! },
// //         select: { topics: true, paused: true, frequency: true },
// //       })
// //     ) as { topics: string; paused: boolean; frequency: string } | null;

// //     if (!pref) {
// //       console.log("[newsletter] no preferences for user; skipping", { internalUserId, runId });
// //       return;
// //     }
// //     if (pref.paused) {
// //       console.log("[newsletter] subscription paused; skipping", { internalUserId, runId });
// //       return;
// //     }

// //     // Use saved topics (no hard-coded categories unless empty)
// //     const terms = topicsToCategories(pref.topics || "");
// //     const effectiveTopics = terms.length > 0 ? terms : ["technology", "business", "politics"];
// //     console.log("[newsletter] effectiveTopics:", effectiveTopics);

// //     // Fetch & summarize
// //     const allArticles = await step.run("fetch-news", () => fetchArticles(effectiveTopics));

// //     const summary = await step.ai.infer("summarize-news", {
// //       model: step.ai.models.openai({ model: "gpt-4o" }),
// //       body: {
// //         messages: [
// //           {
// //             role: "system",
// //             content:
// //               "You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary with clear sections and subject-line worthy headers.",
// //           },
// //           {
// //             role: "user",
// //             content:
// //               `Create a newsletter summary for the past week.\n` +
// //               `Topics: ${effectiveTopics.join(", ")}\n` +
// //               `Frequency: ${pref.frequency}\n\n` +
// //               `Articles:\n` +
// //               allArticles
// //                 .map(
// //                   (a: any, i: number) =>
// //                     `${i + 1}. ${a.title}\n${a.description}\nSource: ${a.url}\n`
// //                 )
// //                 .join("\n"),
// //           },
// //         ],
// //       },
// //     });

// //     console.log("news-summary", summary.choices?.[0]?.message?.content);
// //   }
// // );




// // // src/inngest/news.ts
// // import { inngest } from "./client";
// // import { fetchArticles } from "./functions";
// // import { prisma } from "@/lib/prisma";
// // import { topicsToCategories } from "@/lib/topics";
// // import { buildNewsletterHtml } from "@/lib/newsletter-html";
// // import { sendEmail } from "@/lib/mailer";
// // import { nextSendAtFrom } from "@/lib/frequency";

// // type EventData = { userId?: string; kindeId?: string };

// // export default inngest.createFunction(
// //   { id: "newsletter" },
// //   { event: "scheduled.newsletter" },
// //   async ({ event, step, runId }) => {
// //     const data = (event.data as EventData) || {};
// //     let internalUserId = data.userId;

// //     if (!internalUserId && data.kindeId) {
// //       const found = await step.run("resolve-user-by-kinde", () =>
// //         prisma.user.findUnique({ where: { kindeId: data.kindeId! }, select: { id: true } })
// //       ) as { id: string } | null;
// //       internalUserId = found?.id;
// //     }

// //     if (!internalUserId) {
// //       console.log("[newsletter] missing internal user id; skipping", { runId });
// //       return;
// //     }

// //     // Load user + prefs (get email for Resend "to")
// //     const { pref, user } = await step.run("load-user-and-preferences", async () => {
// //       const [pref, user] = await Promise.all([
// //         prisma.preference.findUnique({
// //           where: { userId: internalUserId! },
// //           select: { topics: true, paused: true, frequency: true },
// //         }),
// //         prisma.user.findUnique({
// //           where: { id: internalUserId! },
// //           select: { email: true, name: true },
// //         }),
// //       ]);
// //       return { pref, user };
// //     });

// //     if (!pref) return console.log("[newsletter] no preferences; skipping", { internalUserId, runId });
// //     if (pref.paused) return console.log("[newsletter] paused; skipping", { internalUserId, runId });
// //     if (!user?.email) return console.log("[newsletter] no email; skipping", { internalUserId, runId });

// //     const effectiveTopics = (() => {
// //       const terms = topicsToCategories(pref.topics || "");
// //       return terms.length > 0 ? terms : ["technology", "business", "politics"];
// //     })();

// //     const allArticles = await step.run("fetch-news", () => fetchArticles(effectiveTopics));

// //     const ai = await step.ai.infer("summarize-news", {
// //       model: step.ai.models.openai({ model: "gpt-4o" }),
// //       body: {
// //         messages: [
// //           {
// //             role: "system",
// //             content:
// //               "You are an expert newsletter editor. Produce a concise, engaging, sectioned newsletter body (no HTML, plain text with line breaks). Include short headers and bulleted takeaways. End with 3–5 quick links.",
// //           },
// //           {
// //             role: "user",
// //             content:
// //               `Create a newsletter summary.\n` +
// //               `Topics: ${effectiveTopics.join(", ")}\n` +
// //               `Articles:\n` +
// //               allArticles
// //                 .map((a: any, i: number) => `${i + 1}. ${a.title}\n${a.description}\n${a.url}\n`)
// //                 .join("\n"),
// //           },
// //         ],
// //       },
// //     });

// //     const bodyText = ai.choices?.[0]?.message?.content?.trim() || "No summary available.";
// //     const subject = `Your ${pref.frequency.toLowerCase()} AI Newsletter — ${new Date().toLocaleDateString()}`;
// //     const html = buildNewsletterHtml({ title: subject, body: bodyText });

// //     // Persist Issue first (so Delivery can reference it)
// //     const issue = await step.run("create-issue", () =>
// //       prisma.issue.create({
// //         data: {
// //           title: subject,
// //           html,
// //           metaJson: JSON.stringify({
// //             topics: effectiveTopics,
// //             count: allArticles.length,
// //             generatedAt: new Date().toISOString(),
// //           }),
// //         },
// //         select: { id: true },
// //       })
// //     ) as { id: string };

// //     // Send email (Resend)
// //     let deliveryStatus: "SENT" | "FAILED" = "SENT";
// //     let deliveryError: string | null = null;

// //     try {
// //       await step.run("send-email", () =>
// //         sendEmail({
// //           to: user.email!,
// //           subject,
// //           html,
// //         })
// //       );
// //     } catch (err: any) {
// //       deliveryStatus = "FAILED";
// //       deliveryError = err?.message || String(err);
// //     }

// //     // Record Delivery regardless of success/failure
// //     await step.run("record-delivery", () =>
// //       prisma.delivery.create({
// //         data: {
// //           userId: internalUserId!,
// //           issueId: issue.id,
// //           status: deliveryStatus,
// //           error: deliveryError,
// //         },
// //       })
// //     );

// //     // Update preference timestamps
// //     await step.run("bump-preference-schedule", () =>
// //       prisma.preference.update({
// //         where: { userId: internalUserId! },
// //         data: {
// //           lastSentAt: new Date(),
// //           nextSendAt: nextSendAtFrom(pref.frequency as any),
// //         },
// //       })
// //     );

// //     console.log("[newsletter] finished", {
// //       userId: internalUserId,
// //       status: deliveryStatus,
// //       runId,
// //     });
// //   }
// // );



// // //src/inngest/news.ts
// // import { inngest } from "./client";
// // import { fetchArticles } from "./functions";
// // import { prisma } from "@/lib/prisma";
// // import { topicsToCategories } from "@/lib/topics";
// // import { buildNewsletterHtml } from "@/lib/newsletter-html";
// // import { sendEmail } from "@/lib/mailer";
// // import { nextSendAtFrom } from "@/lib/frequency";

// // type EventData = { userId?: string; kindeId?: string; topicsInline?: string };

// // export default inngest.createFunction(
// //   { id: "newsletter" },
// //   { event: "scheduled.newsletter" },
// //   async ({ event, step, runId }) => {
// //     const data = (event.data as EventData) || {};
// //     let internalUserId = data.userId || null;

// //     if (!internalUserId && data.kindeId) {
// //       const found = await step.run("resolve-user-by-kinde", () =>
// //         prisma.user.findUnique({
// //           where: { kindeId: data.kindeId! },
// //           select: { id: true },
// //         })
// //       ) as { id: string } | null;
// //       internalUserId = found?.id ?? null;
// //     }

// //     if (!internalUserId) {
// //       console.log("[newsletter] missing internal user id; skipping", { runId, dataKeys: Object.keys(data) });
// //       return;
// //     }

// //     const { pref, user } = await step.run("load-user-and-preferences", async () => {
// //       const [pref, user] = await Promise.all([
// //         prisma.preference.findUnique({
// //           where: { userId: internalUserId! },
// //           select: { topics: true, paused: true, frequency: true },
// //         }),
// //         prisma.user.findUnique({
// //           where: { id: internalUserId! },
// //           select: { email: true, name: true },
// //         }),
// //       ]);
// //       return { pref, user };
// //     });

// //     if (!pref) { console.log("[newsletter] no preferences; skipping", { internalUserId, runId }); return; }
// //     if (pref.paused) { console.log("[newsletter] paused; skipping", { internalUserId, runId }); return; }
// //     if (!user?.email) { console.log("[newsletter] no email; skipping", { internalUserId, runId }); return; }

// //     const effectiveTopics = (() => {
// //       const terms = topicsToCategories(data.topicsInline || pref.topics || "");
// //       return terms.length > 0 ? terms : ["technology", "business", "politics"];
// //     })();

// //     const allArticles = await step.run("fetch-news", () => fetchArticles(effectiveTopics));

// //     const ai = await step.ai.infer("summarize-news", {
// //       model: step.ai.models.openai({ model: "gpt-4o" }),
// //       body: {
// //         messages: [
// //           {
// //             role: "system",
// //             content:
// //               "You are an expert newsletter editor. Produce a concise, engaging, sectioned newsletter body (no HTML, plain text). Include short headers and bulleted takeaways. End with 3–5 quick links.",
// //           },
// //           {
// //             role: "user",
// //             content:
// //               `Create a newsletter summary.\n` +
// //               `Topics: ${effectiveTopics.join(", ")}\n` +
// //               `Articles:\n` +
// //               (allArticles ?? [])
// //                 .map((a: any, i: number) => `${i + 1}. ${a.title}\n${a.description}\n${a.url}\n`)
// //                 .join("\n"),
// //           },
// //         ],
// //       },
// //     });

// //     const bodyText = ai.choices?.[0]?.message?.content?.trim() || "No summary available.";
// //     const subject = `Your ${pref.frequency.toLowerCase()} AI Newsletter — ${new Date().toLocaleDateString()}`;
// //     const html = buildNewsletterHtml({ title: subject, body: bodyText });

// //     // Persist Issue (for Delivery reference/analytics)
// //     const issue = await step.run("create-issue", () =>
// //       prisma.issue.create({
// //         data: {
// //           title: subject,
// //           html,
// //           metaJson: JSON.stringify({
// //             topics: effectiveTopics,
// //             count: (allArticles ?? []).length,
// //             generatedAt: new Date().toISOString(),
// //           }),
// //         },
// //         select: { id: true },
// //       })
// //     ) as { id: string };

// //     // Send email
// //     let deliveryStatus: "SENT" | "FAILED" = "SENT";
// //     let deliveryError: string | null = null;

// //     try {
// //       await step.run("send-email", () =>
// //         sendEmail({
// //           to: user.email!,
// //           subject,
// //           html,
// //         })
// //       );
// //     } catch (err: any) {
// //       deliveryStatus = "FAILED";
// //       deliveryError = err?.message || String(err);
// //     }

// //     const now = new Date();

// //     // Record delivery
// //     await step.run("record-delivery", () =>
// //       prisma.delivery.create({
// //         data: {
// //           userId: internalUserId!,
// //           issueId: issue.id,
// //           status: deliveryStatus,
// //           error: deliveryError,
// //           // optional if your schema includes these:
// //           toEmail: user.email!,
// //           toName: user.name ?? null,
// //           sentAt: now,
// //           subject,
// //         },
// //       })
// //     );

// //     // Advance schedule only on success; otherwise retry in ~15 min
// //     if (deliveryStatus === "SENT") {
// //       await step.run("bump-preference-schedule-success", () =>
// //         prisma.preference.update({
// //           where: { userId: internalUserId! },
// //           data: {
// //             lastSentAt: now,
// //             nextSendAt: nextSendAtFrom(pref.frequency as any, now),
// //           },
// //         })
// //       );
// //     } else {
// //       const retryAt = new Date(now.getTime() + 15 * 60_000);
// //       await step.run("bump-preference-schedule-retry", () =>
// //         prisma.preference.update({
// //           where: { userId: internalUserId! },
// //           data: { nextSendAt: retryAt },
// //         })
// //       );
// //     }

// //     console.log("[newsletter] finished", {
// //       userId: internalUserId,
// //       status: deliveryStatus,
// //       runId,
// //     });
// //   }
// // );






// // src/inngest/news.ts
// import { inngest } from "./client";
// import { fetchArticles } from "./functions";
// import { prisma } from "@/lib/prisma";
// import { topicsToCategories } from "@/lib/topics";
// import { buildNewsletterHtml } from "@/lib/newsletter-html";
// import { sendEmail } from "@/lib/mailer";
// import { nextSendAtFrom } from "@/lib/frequency";

// type EventData = { userId?: string; kindeId?: string; topicsInline?: string };

// export default inngest.createFunction(
//   { id: "newsletter@v2" }, // ← bump to ensure the newest build runs
//   { event: "scheduled.newsletter" },
//   async ({ event, step, runId }) => {
//     const data = (event.data as EventData) || {};
//     let internalUserId = data.userId || null;

//     if (!internalUserId && data.kindeId) {
//       const found = (await step.run("resolve-user-by-kinde", () =>
//         prisma.user.findUnique({
//           where: { kindeId: data.kindeId! },
//           select: { id: true },
//         })
//       )) as { id: string } | null;
//       internalUserId = found?.id ?? null;
//     }

//     if (!internalUserId) {
//       console.log("[newsletter] missing internal user id; skipping", { runId, dataKeys: Object.keys(data) });
//       return;
//     }

//     const { pref, user } = await step.run("load-user-and-preferences", async () => {
//       const [pref, user] = await Promise.all([
//         prisma.preference.findUnique({
//           where: { userId: internalUserId! },
//           select: { topics: true, paused: true, frequency: true },
//         }),
//         prisma.user.findUnique({
//           where: { id: internalUserId! },
//           select: { email: true, name: true },
//         }),
//       ]);
//       return { pref, user };
//     });

//     if (!pref) { console.log("[newsletter] no preferences; skipping", { internalUserId, runId }); return; }
//     if (pref.paused) { console.log("[newsletter] paused; skipping", { internalUserId, runId }); return; }
//     if (!user?.email) { console.log("[newsletter] no email; skipping", { internalUserId, runId }); return; }

//     const effectiveTopics = (() => {
//       const terms = topicsToCategories(data.topicsInline || pref.topics || "");
//       return terms.length > 0 ? terms : ["technology", "business", "politics"];
//     })();

//     const allArticles = await step.run("fetch-news", () => fetchArticles(effectiveTopics));

//     const ai = await step.ai.infer("summarize-news", {
//       model: step.ai.models.openai({ model: "gpt-4o" }),
//       body: {
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an expert newsletter editor. Produce a concise, engaging, sectioned newsletter body (no HTML, plain text). Include short headers and bulleted takeaways. End with 3–5 quick links.",
//           },
//           {
//             role: "user",
//             content:
//               `Create a newsletter summary.\n` +
//               `Topics: ${effectiveTopics.join(", ")}\n` +
//               `Articles:\n` +
//               (allArticles ?? [])
//                 .map((a: any, i: number) => `${i + 1}. ${a.title}\n${a.description}\n${a.url}\n`)
//                 .join("\n"),
//           },
//         ],
//       },
//     });

//     const bodyText = ai.choices?.[0]?.message?.content?.trim() || "No summary available.";
//     const subject =
//       `Your ${(pref.frequency || "DAILY").toLowerCase()} AI Newsletter — ${new Date().toLocaleDateString()}`;

//     const html = buildNewsletterHtml({ title: subject, body: bodyText });

//     // Persist Issue (for Delivery reference/analytics)
//     const issue = (await step.run("create-issue", () =>
//       prisma.issue.create({
//         data: {
//           title: subject,
//           html,
//           metaJson: JSON.stringify({
//             topics: effectiveTopics,
//             count: (allArticles ?? []).length,
//             generatedAt: new Date().toISOString(),
//           }),
//         },
//         select: { id: true },
//       })
//     )) as { id: string };

//     // Send email
//     let deliveryStatus: "SENT" | "FAILED" = "SENT";
//     let deliveryError: string | null = null;

//     try {
//       await step.run("send-email", () =>
//         sendEmail({
//           to: user.email!, // recipient must exist (guarded above)
//           subject,
//           html,
//         })
//       );
//     } catch (err: any) {
//       deliveryStatus = "FAILED";
//       deliveryError = err?.message || String(err);
//     }

//     const now = new Date();

//     // 🔎 Debug just before write
//     const recipientEmail = (user?.email ?? "").trim() || null;
//     const recipientName = (user?.name ?? "").trim() || null;
//     console.log("[delivery.debug] will create", {
//       userId: internalUserId,
//       subject,
//       toEmail: recipientEmail,
//       toName: recipientName,
//       status: deliveryStatus,
//     });

//     // Record delivery (explicit values, no chance of empty surprise)
//     const created = await step.run("record-delivery", () =>
//       prisma.delivery.create({
//         data: {
//           userId: internalUserId!,
//           issueId: issue.id,
//           status: deliveryStatus,
//           error: deliveryError,
//           subject: subject || "AI Newsletter",
//           toEmail: recipientEmail,
//           toName: recipientName,
//           sentAt: now,
//         },
//         select: { id: true, subject: true, toEmail: true, toName: true, status: true },
//       })
//     );

//     console.log("[delivery.debug] created", created);

//     // Advance schedule only on success; otherwise retry in ~15 min
//     if (deliveryStatus === "SENT") {
//       await step.run("bump-preference-schedule-success", () =>
//         prisma.preference.update({
//           where: { userId: internalUserId! },
//           data: {
//             lastSentAt: now,
//             nextSendAt: nextSendAtFrom(pref.frequency as any, now),
//           },
//         })
//       );
//     } else {
//       const retryAt = new Date(now.getTime() + 15 * 60_000);
//       await step.run("bump-preference-schedule-retry", () =>
//         prisma.preference.update({
//           where: { userId: internalUserId! },
//           data: { nextSendAt: retryAt },
//         })
//       );
//     }

//     console.log("[newsletter] finished", {
//       userId: internalUserId,
//       status: deliveryStatus,
//       runId,
//     });
//   }
// );





import { inngest } from "./client";
import { fetchArticles } from "./functions";
import { prisma } from "@/lib/prisma";
import { topicsToCategories } from "@/lib/topics";
import { buildNewsletterHtml } from "@/lib/newsletter-html";
import { sendEmail } from "@/lib/mailer";
import { nextSendAtFrom } from "@/lib/frequency";

type EventData = { userId?: string; kindeId?: string; topicsInline?: string };

export default inngest.createFunction(
  { id: "newsletter" },   // ✅ single canonical id
  { event: "scheduled.newsletter" },
  async ({ event, step, runId }) => {
    const data = (event.data as EventData) || {};
    let internalUserId = data.userId || null;

    // Resolve Prisma user id if only kindeId is provided
    if (!internalUserId && data.kindeId) {
      const found = (await step.run("resolve-user-by-kinde", () =>
        prisma.user.findUnique({
          where: { kindeId: data.kindeId! },
          select: { id: true },
        })
      )) as { id: string } | null;
      internalUserId = found?.id ?? null;
    }

    if (!internalUserId) {
      console.log("[newsletter] missing internal user id; skipping", { runId, dataKeys: Object.keys(data) });
      return;
    }

    // Load preferences + user
    const { pref, user } = await step.run("load-user-and-preferences", async () => {
      const [pref, user] = await Promise.all([
        prisma.preference.findUnique({
          where: { userId: internalUserId! },
          select: { topics: true, paused: true, frequency: true },
        }),
        prisma.user.findUnique({
          where: { id: internalUserId! },
          select: { email: true, name: true },
        }),
      ]);
      return { pref, user };
    });

    if (!pref) { console.log("[newsletter] no preferences; skipping", { internalUserId, runId }); return; }
    if (pref.paused) { console.log("[newsletter] paused; skipping", { internalUserId, runId }); return; }
    if (!user?.email) { console.log("[newsletter] no email; skipping", { internalUserId, runId }); return; }

    // Compute effective topics
    const effectiveTopics = (() => {
      const terms = topicsToCategories(data.topicsInline || pref.topics || "");
      return terms.length > 0 ? terms : ["technology", "business", "politics"];
    })();

    // Fetch articles
    const allArticles = await step.run("fetch-news", () => fetchArticles(effectiveTopics));

    // Summarize via AI
    const ai = await step.ai.infer("summarize-news", {
      model: step.ai.models.openai({ model: "gpt-4o" }),
      body: {
        messages: [
          {
            role: "system",
            content:
              "You are an expert newsletter editor. Produce a concise, engaging, sectioned newsletter body (no HTML, plain text). Include short headers and bulleted takeaways. End with 3–5 quick links.",
          },
          {
            role: "user",
            content:
              `Create a newsletter summary.\n` +
              `Topics: ${effectiveTopics.join(", ")}\n` +
              `Articles:\n` +
              (allArticles ?? [])
                .map((a: any, i: number) => `${i + 1}. ${a.title}\n${a.description}\n${a.url}\n`)
                .join("\n"),
          },
        ],
      },
    });

    const bodyText = ai.choices?.[0]?.message?.content?.trim() || "No summary available.";
    const subject = `Your ${(pref.frequency || "DAILY").toLowerCase()} AI Newsletter — ${new Date().toLocaleDateString()}`;
    const html = buildNewsletterHtml({ title: subject, body: bodyText });

    // Persist Issue
    const issue = (await step.run("create-issue", () =>
      prisma.issue.create({
        data: {
          title: subject,
          html,
          metaJson: JSON.stringify({
            topics: effectiveTopics,
            count: (allArticles ?? []).length,
            generatedAt: new Date().toISOString(),
          }),
        },
        select: { id: true },
      })
    )) as { id: string };

    // Send email
    let deliveryStatus: "SENT" | "FAILED" = "SENT";
    let deliveryError: string | null = null;

    try {
      await step.run("send-email", () =>
        sendEmail({ to: user.email!, subject, html })
      );
    } catch (err: any) {
      deliveryStatus = "FAILED";
      deliveryError = err?.message || String(err);
    }

    const now = new Date();
    const recipientEmail = (user?.email ?? "").trim() || null;
    const recipientName = (user?.name ?? "").trim() || null;

    await step.run("record-delivery", () =>
      prisma.delivery.create({
        data: {
          userId: internalUserId!,
          issueId: issue.id,
          status: deliveryStatus,
          error: deliveryError,
          subject: subject || "AI Newsletter",
          toEmail: recipientEmail,
          toName: recipientName,
          sentAt: now,
        },
        select: { id: true },
      })
    );

    // Advance schedule
    if (deliveryStatus === "SENT") {
      await step.run("bump-preference-schedule-success", () =>
        prisma.preference.update({
          where: { userId: internalUserId! },
          data: {
            lastSentAt: now,
            nextSendAt: nextSendAtFrom(pref.frequency as any, now),
          },
        })
      );
    } else {
      const retryAt = new Date(now.getTime() + 15 * 60_000);
      await step.run("bump-preference-schedule-retry", () =>
        prisma.preference.update({
          where: { userId: internalUserId! },
          data: { nextSendAt: retryAt },
        })
      );
    }

    console.log("[newsletter] finished", { userId: internalUserId, status: deliveryStatus, runId });
  }
);
