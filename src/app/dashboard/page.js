// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import {
// // //   Card,
// // //   CardHeader,
// // //   CardTitle,
// // //   CardDescription,
// // //   CardContent,
// // //   CardFooter,
// // // } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Label } from "@/components/ui/label";
// // // import { Input } from "@/components/ui/input";
// // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // import { CheckCircle2, AlertCircle, Loader2, Sparkles, Tag } from "lucide-react";

// // // const FREQUENCIES = [
// // //   { value: "DAILY", label: "Daily" },
// // //   { value: "BIWEEKLY", label: "Biweekly" },
// // //   { value: "MONTHLY", label: "Monthly" },
// // // ];

// // // export default function Dashboard() {
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [frequency, setFrequency] = useState("DAILY");
// // //   const [topics, setTopics] = useState("");
// // //   const [notice, setNotice] = useState(null); // { type: "success" | "error", message: string }

// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const res = await fetch("/api/preferences", { cache: "no-store" });
// // //         if (res.ok) {
// // //           const json = await res.json();
// // //           if (json?.preference) {
// // //             setFrequency(json.preference.frequency);
// // //             setTopics(json.preference.topics ?? "");
// // //           }
// // //         }
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, []);

// // //   async function save() {
// // //     setSaving(true);
// // //     setNotice(null);
// // //     try {
// // //       const res = await fetch("/api/preferences", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ frequency, topics }),
// // //       });
// // //       if (!res.ok) throw new Error("Could not save preferences.");
// // //       setNotice({ type: "success", message: "Your preferences were updated." });
// // //     } catch (err) {
// // //       setNotice({ type: "error", message: err?.message || "Something went wrong." });
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   }

// // //   return (
// // //     <main className="min-h-dvh bg-gradient-to-b from-background to-muted/40 flex items-center justify-center px-4 py-10">
// // //       <Card className="w-full max-w-2xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md transition-shadow">
// // //         <CardHeader className="space-y-3">
// // //           <div className="inline-flex items-center gap-2 text-xs md:text-sm rounded-full border px-3 py-1 bg-muted">
// // //             <Sparkles className="h-4 w-4" />
// // //             AI Newsletter
// // //           </div>
// // //           <CardTitle className="text-2xl md:text-3xl tracking-tight">
// // //             Your Newsletter
// // //           </CardTitle>
// // //           <CardDescription>
// // //             Pick how often you want summaries and (optionally) the topics you care about.
// // //           </CardDescription>
// // //         </CardHeader>

// // //         <CardContent className="space-y-6">
// // //           {/* Inline notice (no toast) */}
// // //           <div aria-live="polite">
// // //             {notice && (
// // //               <Alert
// // //                 variant={notice.type === "success" ? "default" : "destructive"}
// // //                 className="text-left"
// // //               >
// // //                 <div className="flex items-start gap-2">
// // //                   {notice.type === "success" ? (
// // //                     <CheckCircle2 className="h-4 w-4 mt-0.5" />
// // //                   ) : (
// // //                     <AlertCircle className="h-4 w-4 mt-0.5" />
// // //                   )}
// // //                   <AlertDescription>{notice.message}</AlertDescription>
// // //                 </div>
// // //               </Alert>
// // //             )}
// // //           </div>

// // //           {/* Frequency (segmented control) */}
// // //           <div className="space-y-2">
// // //             <Label>Frequency</Label>
// // //             <div className="grid grid-cols-3 gap-2">
// // //               {FREQUENCIES.map((f) => {
// // //                 const active = f.value === frequency;
// // //                 return (
// // //                   <button
// // //                     key={f.value}
// // //                     type="button"
// // //                     disabled={loading || saving}
// // //                     onClick={() => setFrequency(f.value)}
// // //                     className={[
// // //                       "rounded-xl border px-3 py-2 text-sm font-medium transition",
// // //                       active
// // //                         ? "bg-primary text-primary-foreground border-primary shadow-sm"
// // //                         : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80",
// // //                       (loading || saving) && "opacity-70 cursor-not-allowed",
// // //                     ].join(" ")}
// // //                     aria-pressed={active}
// // //                   >
// // //                     {f.label}
// // //                   </button>
// // //                 );
// // //               })}
// // //             </div>
// // //             <p className="text-xs text-muted-foreground">
// // //               Biweekly = every 2 weeks.
// // //             </p>
// // //           </div>

// // //           {/* Topics */}
// // //           <div className="space-y-2">
// // //             <Label>
// // //               Topics <span className="text-xs text-muted-foreground">(comma separated, optional)</span>
// // //             </Label>
// // //             <div className="relative">
// // //               <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // //               <Input
// // //                 value={topics}
// // //                 onChange={(e) => setTopics(e.target.value)}
// // //                 placeholder="ai, genai, ml"
// // //                 disabled={loading || saving}
// // //                 className="pl-9"
// // //               />
// // //             </div>
// // //           </div>
// // //         </CardContent>

// // //         <CardFooter className="flex items-center justify-between gap-3">
// // //           <p className="text-xs text-muted-foreground">
// // //             You can update these anytime.
// // //           </p>
// // //           <Button onClick={save} disabled={loading || saving}>
// // //             {saving ? (
// // //               <>
// // //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // //                 Saving…
// // //               </>
// // //             ) : (
// // //               "Save preferences"
// // //             )}
// // //           </Button>
// // //         </CardFooter>
// // //       </Card>
// // //     </main>
// // //   );
// // // }





// // // app/dashboard/page.jsx
// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import { Input } from "@/components/ui/input";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import { Switch } from "@/components/ui/switch";   // <— shadcn switch
// // import { CheckCircle2, AlertCircle, Loader2, Sparkles, Tag, PauseCircle } from "lucide-react";

// // const FREQUENCIES = [
// //   { value: "DAILY", label: "Daily" },
// //   { value: "BIWEEKLY", label: "Biweekly" },
// //   { value: "MONTHLY", label: "Monthly" },
// // ];

// // export default function Dashboard() {
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [pausing, setPausing] = useState(false);
// //   const [paused, setPaused] = useState(false);           // <— NEW
// //   const [frequency, setFrequency] = useState("DAILY");
// //   const [topics, setTopics] = useState("");
// //   const [notice, setNotice] = useState(null);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const res = await fetch("/api/preferences", { cache: "no-store" });
// //         if (res.ok) {
// //           const json = await res.json();
// //           const p = json?.preference;
// //           if (p) {
// //             setFrequency(p.frequency);
// //             setTopics(p.topics ?? "");
// //             setPaused(Boolean(p.paused));               // <— NEW
// //           }
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, []);

// //   // Save frequency/topics
// //   async function save() {
// //     setSaving(true);
// //     setNotice(null);
// //     try {
// //       const res = await fetch("/api/preferences", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ frequency, topics, paused }), // keep consistent
// //       });
// //       if (!res.ok) throw new Error("Could not save preferences.");
// //       setNotice({ type: "success", message: "Your preferences were updated." });
// //     } catch (err) {
// //       setNotice({ type: "error", message: err?.message || "Something went wrong." });
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   // Auto-save pause toggle
// //   async function togglePause(next) {
// //     setPausing(true);
// //     setNotice(null);
// //     const prev = paused;
// //     setPaused(next); // optimistic
// //     try {
// //       const res = await fetch("/api/preferences", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ paused: next }), // only send pause change
// //       });
// //       if (!res.ok) throw new Error("Could not update pause status.");
// //       setNotice({
// //         type: "success",
// //         message: next
// //           ? "Paused — you won't receive newsletters."
// //           : "Resumed — newsletters are active again.",
// //       });
// //     } catch (err) {
// //       setPaused(prev); // rollback
// //       setNotice({ type: "error", message: err?.message || "Something went wrong." });
// //     } finally {
// //       setPausing(false);
// //     }
// //   }

// //   return (
// //     <main className="min-h-dvh bg-gradient-to-b from-background to-muted/40 flex items-center justify-center px-4 py-10">
// //       <Card className="w-full max-w-2xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md transition-shadow">
// //         <CardHeader className="space-y-3">
// //           <div className="inline-flex items-center gap-2 text-xs md:text-sm rounded-full border px-3 py-1 bg-muted">
// //             <Sparkles className="h-4 w-4" />
// //             AI Newsletter
// //           </div>
// //           <CardTitle className="text-2xl md:text-3xl tracking-tight">Your Newsletter</CardTitle>
// //           <CardDescription>Pick how often you want summaries and (optionally) the topics you care about.</CardDescription>
// //         </CardHeader>

// //         <CardContent className="space-y-6">
// //           {/* Inline notice */}
// //           <div aria-live="polite">
// //             {notice && (
// //               <Alert variant={notice.type === "success" ? "default" : "destructive"} className="text-left">
// //                 <div className="flex items-start gap-2">
// //                   {notice.type === "success" ? (
// //                     <CheckCircle2 className="h-4 w-4 mt-0.5" />
// //                   ) : (
// //                     <AlertCircle className="h-4 w-4 mt-0.5" />
// //                   )}
// //                   <AlertDescription>{notice.message}</AlertDescription>
// //                 </div>
// //               </Alert>
// //             )}
// //           </div>

// //           {/* Pause toggle */}
// //           <div className="space-y-2">
// //             <Label htmlFor="paused" className="flex items-center gap-2">
// //               <PauseCircle className="h-4 w-4" />
// //               Pause subscription
// //             </Label>
// //             <div className="flex items-center gap-3">
// //               <Switch
// //                 id="paused"
// //                 checked={paused}
// //                 onCheckedChange={togglePause}
// //                 disabled={loading || saving || pausing}
// //               />
// //               <span className="text-sm text-muted-foreground">
// //                 {paused ? "Paused — no emails will be sent." : "Active"}
// //               </span>
// //             </div>
// //           </div>

// //           {/* Frequency */}
// //           <div className="space-y-2">
// //             <Label>Frequency</Label>
// //             <div className="grid grid-cols-3 gap-2">
// //               {FREQUENCIES.map((f) => {
// //                 const active = f.value === frequency;
// //                 return (
// //                   <button
// //                     key={f.value}
// //                     type="button"
// //                     disabled={loading || saving}
// //                     onClick={() => setFrequency(f.value)}
// //                     className={[
// //                       "rounded-xl border px-3 py-2 text-sm font-medium transition",
// //                       active
// //                         ? "bg-primary text-primary-foreground border-primary shadow-sm"
// //                         : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80",
// //                     ].join(" ")}
// //                     aria-pressed={active}
// //                   >
// //                     {f.label}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //             <p className="text-xs text-muted-foreground">Biweekly = every 2 weeks.</p>
// //           </div>

// //           {/* Topics */}
// //           <div className="space-y-2">
// //             <Label>
// //               Topics <span className="text-xs text-muted-foreground">(comma separated, optional)</span>
// //             </Label>
// //             <div className="relative">
// //               <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //               <Input
// //                 value={topics}
// //                 onChange={(e) => setTopics(e.target.value)}
// //                 placeholder="ai, genai, ml"
// //                 disabled={loading || saving}
// //                 className="pl-9"
// //               />
// //             </div>
// //           </div>
// //         </CardContent>

// //         <CardFooter className="flex items-center justify-between gap-3">
// //           <p className="text-xs text-muted-foreground">
// //             {paused ? "Paused — you can still change topics/frequency." : "You can update these anytime."}
// //           </p>
// //           <Button onClick={save} disabled={loading || saving}>
// //             {saving ? (
// //               <>
// //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                 Saving…
// //               </>
// //             ) : (
// //               "Save preferences"
// //             )}
// //           </Button>
// //         </CardFooter>
// //       </Card>
// //     </main>
// //   );
// // }



// // app/dashboard/page.jsx
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Switch } from "@/components/ui/switch";
// import { CheckCircle2, AlertCircle, Loader2, Sparkles, Tag, PauseCircle } from "lucide-react";

// const FREQUENCIES = [
//   { value: "DAILY", label: "Daily" },
//   { value: "BIWEEKLY", label: "Biweekly" },
//   { value: "MONTHLY", label: "Monthly" },
// ];

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [pausing, setPausing] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [frequency, setFrequency] = useState("DAILY");
//   const [topics, setTopics] = useState("");
//   const [notice, setNotice] = useState(null);

//   // purely visual: show how the input will be parsed/saved
//   const [effectiveTopics, setEffectiveTopics] = useState([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/preferences", { cache: "no-store" });
//         if (res.ok) {
//           const json = await res.json();
//           const p = json?.preference;
//           if (p) {
//             setFrequency(p.frequency);
//             setTopics(p.topics ?? "");
//             setPaused(Boolean(p.paused));
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // live-derive chips from current input
//   useEffect(() => {
//     const parsed = Array.from(
//       new Set(
//         String(topics || "")
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean)
//       )
//     );
//     setEffectiveTopics(parsed);
//   }, [topics]);

//   async function save() {
//     setSaving(true);
//     setNotice(null);
//     try {
//       const res = await fetch("/api/preferences", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ frequency, topics, paused }),
//       });
//       if (!res.ok) throw new Error("Could not save preferences.");

//       // server will enqueue Inngest if not paused
//       setNotice({
//         type: "success",
//         message: paused
//           ? "Preferences saved. Subscription is paused."
//           : "Preferences saved. We’ll generate your newsletter shortly.",
//       });
//     } catch (err) {
//       setNotice({ type: "error", message: err?.message || "Something went wrong." });
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function togglePause(next) {
//     setPausing(true);
//     setNotice(null);
//     const prev = paused;
//     setPaused(next);
//     try {
//       const res = await fetch("/api/preferences", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ paused: next }),
//       });
//       if (!res.ok) throw new Error("Could not update pause status.");
//       setNotice({
//         type: "success",
//         message: next
//           ? "Paused — you won't receive newsletters."
//           : "Resumed — newsletters are active again.",
//       });
//     } catch (err) {
//       setPaused(prev);
//       setNotice({ type: "error", message: err?.message || "Something went wrong." });
//     } finally {
//       setPausing(false);
//     }
//   }

//   return (
//     <main className="min-h-dvh bg-gradient-to-b from-background to-muted/40 flex items-center justify-center px-4 py-10">
//       <Card className="w-full max-w-2xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md transition-shadow">
//         <CardHeader className="space-y-3">
//           <div className="inline-flex items-center gap-2 text-xs md:text-sm rounded-full border px-3 py-1 bg-muted">
//             <Sparkles className="h-4 w-4" />
//             AI Newsletter
//           </div>
//           <CardTitle className="text-2xl md:text-3xl tracking-tight">Your Newsletter</CardTitle>
//           <CardDescription>Pick how often you want summaries and (optionally) the topics you care about.</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Inline notice */}
//           <div aria-live="polite">
//             {notice && (
//               <Alert variant={notice.type === "success" ? "default" : "destructive"} className="text-left">
//                 <div className="flex items-start gap-2">
//                   {notice.type === "success" ? (
//                     <CheckCircle2 className="h-4 w-4 mt-0.5" />
//                   ) : (
//                     <AlertCircle className="h-4 w-4 mt-0.5" />
//                   )}
//                   <AlertDescription>{notice.message}</AlertDescription>
//                 </div>
//               </Alert>
//             )}
//           </div>

//           {/* Pause toggle */}
//           <div className="space-y-2">
//             <Label htmlFor="paused" className="flex items-center gap-2">
//               <PauseCircle className="h-4 w-4" />
//               Pause subscription
//             </Label>
//             <div className="flex items-center gap-3">
//               <Switch
//                 id="paused"
//                 checked={paused}
//                 onCheckedChange={togglePause}
//                 disabled={loading || saving || pausing}
//               />
//               <span className="text-sm text-muted-foreground">
//                 {paused ? "Paused — no emails will be sent." : "Active"}
//               </span>
//             </div>
//           </div>

//           {/* Frequency */}
//           <div className="space-y-2">
//             <Label>Frequency</Label>
//             <div className="grid grid-cols-3 gap-2">
//               {FREQUENCIES.map((f) => {
//                 const active = f.value === frequency;
//                 return (
//                   <button
//                     key={f.value}
//                     type="button"
//                     disabled={loading || saving}
//                     onClick={() => setFrequency(f.value)}
//                     className={[
//                       "rounded-xl border px-3 py-2 text-sm font-medium transition",
//                       active
//                         ? "bg-primary text-primary-foreground border-primary shadow-sm"
//                         : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80",
//                     ].join(" ")}
//                     aria-pressed={active}
//                   >
//                     {f.label}
//                   </button>
//                 );
//               })}
//             </div>
//             <p className="text-xs text-muted-foreground">Biweekly = every 2 weeks.</p>
//           </div>

//           {/* Topics */}
//           <div className="space-y-2">
//             <Label>
//               Topics <span className="text-xs text-muted-foreground">(comma separated, optional)</span>
//             </Label>
//             <div className="relative">
//               <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 value={topics}
//                 onChange={(e) => setTopics(e.target.value)}
//                 placeholder="ai, genai, ml"
//                 disabled={loading || saving}
//                 className="pl-9"
//               />
//             </div>

//             {/* purely visual chips */}
//             <div className="mt-2">
//               <Label className="text-xs text-muted-foreground">effectiveTopics:</Label>
//               {effectiveTopics.length > 0 ? (
//                 <div className="mt-1 flex flex-wrap gap-2">
//                   {effectiveTopics.map((t) => (
//                     <span key={t} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs">
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-xs text-muted-foreground mt-1">(none — server may fallback)</p>
//               )}
//             </div>
//           </div>
//         </CardContent>

//         <CardFooter className="flex items-center justify-between gap-3">
//           <p className="text-xs text-muted-foreground">
//             {paused ? "Paused — you can still change topics/frequency." : "You can update these anytime."}
//           </p>
//           <Button onClick={save} disabled={loading || saving}>
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               "Save preferences"
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </main>
//   );
// }






// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Tag, PauseCircle } from "lucide-react";

const FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "BIWEEKLY", label: "Biweekly" },
  { value: "MONTHLY", label: "Monthly" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [frequency, setFrequency] = useState("DAILY");
  const [topics, setTopics] = useState("");
  const [notice, setNotice] = useState(null);

  // purely visual: show how the input will be parsed/saved
  const [effectiveTopics, setEffectiveTopics] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/preferences", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const p = json?.preference;
          if (p) {
            setFrequency(p.frequency);
            setTopics(p.topics ?? "");
            setPaused(Boolean(p.paused));
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // live-derive chips from current input
  useEffect(() => {
    const parsed = Array.from(
      new Set(
        String(topics || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    setEffectiveTopics(parsed);
  }, [topics]);

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, topics, paused }),
      });
      if (!res.ok) throw new Error("Could not save preferences.");

      const json = await res.json(); // 👈 read { enqueued, eventId }
      setNotice({
        type: "success",
        message: paused
          ? "Preferences saved. Subscription is paused."
          : json.enqueued
            ? "Preferences saved. We’ll generate your newsletter shortly."
            : "Preferences saved, but couldn’t enqueue the newsletter (check Inngest keys/config).",
      });
    } catch (err) {
      setNotice({ type: "error", message: err?.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function togglePause(next) {
    setPausing(true);
    setNotice(null);
    const prev = paused;
    setPaused(next);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused: next }),
      });
      if (!res.ok) throw new Error("Could not update pause status.");
      setNotice({
        type: "success",
        message: next
          ? "Paused — you won't receive newsletters."
          : "Resumed — newsletters are active again.",
      });
    } catch (err) {
      setPaused(prev);
      setNotice({ type: "error", message: err?.message || "Something went wrong." });
    } finally {
      setPausing(false);
    }
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-background to-muted/40 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl border border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm rounded-full border px-3 py-1 bg-muted">
            <Sparkles className="h-4 w-4" />
            AI Newsletter
          </div>
          <CardTitle className="text-2xl md:text-3xl tracking-tight">Your Newsletter</CardTitle>
          <CardDescription>Pick how often you want summaries and (optionally) the topics you care about.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Inline notice */}
          <div aria-live="polite">
            {notice && (
              <Alert variant={notice.type === "success" ? "default" : "destructive"} className="text-left">
                <div className="flex items-start gap-2">
                  {notice.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <AlertDescription>{notice.message}</AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Pause toggle */}
          <div className="space-y-2">
            <Label htmlFor="paused" className="flex items-center gap-2">
              <PauseCircle className="h-4 w-4" />
              Pause subscription
            </Label>
            <div className="flex items-center gap-3">
              <Switch
                id="paused"
                checked={paused}
                onCheckedChange={togglePause}
                disabled={loading || saving || pausing}
              />
              <span className="text-sm text-muted-foreground">
                {paused ? "Paused — no emails will be sent." : "Active"}
              </span>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map((f) => {
                const active = f.value === frequency;
                return (
                  <button
                    key={f.value}
                    type="button"
                    disabled={loading || saving}
                    onClick={() => setFrequency(f.value)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Biweekly = every 2 weeks.</p>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <Label>
              Topics <span className="text-xs text-muted-foreground">(comma separated, optional)</span>
            </Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="ai, genai, ml"
                disabled={loading || saving}
                className="pl-9"
              />
            </div>

            {/* purely visual chips */}
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">effectiveTopics:</Label>
              {effectiveTopics.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {effectiveTopics.map((t) => (
                    <span key={t} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">(none — server may fallback)</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {paused ? "Paused — you can still change topics/frequency." : "You can update these anytime."}
          </p>
          <Button onClick={save} disabled={loading || saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save preferences"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}