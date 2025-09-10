// import { serve } from "inngest/next";
// import { inngest } from "../../../inngest/client";
// import newsletter from "@/inngest/news";
// import scheduler from "@/inngest/scheduler";


// // Create an API that serves zero functions
// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   signingKey: process.env.INNGEST_SIGNING_KEY,
//   functions: [
//   newsletter, scheduler
//     /* your functions will be passed here later! */
//   ],
// });




import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import newsletter from "@/inngest/news";
import scheduler from "@/inngest/scheduler";

export const { GET, POST, PUT } = serve({
  client: inngest,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  functions: [
    newsletter,   // ✅ only one function id now
    scheduler,
  ],
});
