// import { inngest } from "./client";
// import { fetchArticles } from "./functions";

// export default inngest.createFunction(
//   { id: "newsletter" },
//   { event: "scheduled.newsletter" },
//   async ({ event, step, runId }) => {
//     const categories = ["technology", "business", "politics"];
//     const allArticles = await step.run("fetch-news", async () => {
//       return fetchArticles(categories);
//     });

//     const summary = await step.ai.infer("summarize-news", {
//       model: step.ai.models.openai({ model: "gpt-4o" }),
//       body: {
//         messages: [
//           {
//             role: "system",
//             content: `You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary that:
//                     - Highlights the most important stories
//                     - Provides context and insights
//                     - Is well structured with clear sections
//                     - Keeps the reader informed and engaged
//                     Format the response as a proper newsletter with a title and organized content. Make it email-friendly with clear sections and engaging subject lines.`,
//           },
//           {
//             role: "user",
//             content: `Create a newsletter summary for the articles from the past week. Categories requested: ${categories.join(
//               ", "
//             )} 
                    
//                     Articles: ${allArticles.map(
//                       (article: any, idx) =>
//                         `${idx + 1}.${article.title}\n ${
//                           article.description
//                         }\n Source:${article.url}\n`
//                     )}
//                     `,
//           },
//         ],
//       },
//     });
//     console.log("news-summary",summary.choices[0].message.content);
//   }
// );



import { inngest } from "./client";
import { fetchArticles } from "./functions";
import { prisma } from "@/lib/prisma";
import { topicsToCategories } from "@/lib/topics";

type EventData = {
  userId?: string;   // Prisma User.id (cuid)
  kindeId?: string;  // Kinde auth id
};

export default inngest.createFunction(
  { id: "newsletter" },
  { event: "scheduled.newsletter" },
  async ({ event, step, runId }) => {
    const data = (event.data as EventData) || {};
    let internalUserId = data.userId;

    // If only Kinde ID is provided, resolve to internal Prisma user id
    if (!internalUserId && data.kindeId) {
      const user = await step.run("resolve-user-by-kinde", async () =>
        prisma.user.findUnique({
          where: { kindeId: data.kindeId! },
          select: { id: true },
        })
      );
      internalUserId = user?.id;
    }

    if (!internalUserId) {
      console.log("[newsletter] missing internal user id; ignoring", {
        name: event.name,
        dataKeys: Object.keys(event.data ?? {}),
      });
      return;
    }

    // Load user preference (topics + paused)
    const pref = await step.run("load-preferences", async () =>
      prisma.preference.findUnique({
        where: { userId: internalUserId! },
        select: { topics: true, paused: true },
      })
    );

    if (!pref) {
      console.log("[newsletter] no preferences for user; skipping", { internalUserId, runId });
      return;
    }
    if (pref.paused) {
      console.log("[newsletter] subscription paused; skipping", { internalUserId, runId });
      return;
    }

    // Derive categories from saved topics (comma-separated string)
    const derived = topicsToCategories(pref.topics);
    const categories =
      derived.length > 0 ? derived : ["technology", "business", "politics"]; // fallback

    // Fetch articles for *user-chosen* categories
    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    // Create newsletter summary
    const summary = await step.ai.infer("summarize-news", {
      model: step.ai.models.openai({ model: "gpt-4o" }),
      body: {
        messages: [
          {
            role: "system",
            content: `You are an expert newsletter editor creating a personalized newsletter. Write a concise, engaging summary that:
- Highlights the most important stories
- Provides context and insights
- Is well structured with clear sections
- Keeps the reader informed and engaged
Format the response as a proper newsletter with a title and organized content. Make it email-friendly with clear sections and engaging subject lines.`,
          },
          {
            role: "user",
            content:
              `Create a newsletter summary for the articles from the past week.\n` +
              `Categories requested: ${categories.join(", ")}\n\n` +
              `Articles:\n` +
              allArticles
                .map(
                  (article: any, idx: number) =>
                    `${idx + 1}. ${article.title}\n${article.description}\nSource: ${article.url}\n`
                )
                .join("\n"),
          },
        ],
      },
    });

    console.log("news-summary", summary.choices?.[0]?.message?.content);
  }
);
