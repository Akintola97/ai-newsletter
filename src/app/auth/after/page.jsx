// // app/auth/after/page.jsx  (Server Component)
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";

// export default async function AfterLogin() {
//   const { isAuthenticated, getUser } = getKindeServerSession();
//   if (!(await isAuthenticated())) redirect("/");

//   const u = await getUser();
//   console.log(u)
//   const email = u.email?.toLowerCase() ?? null;
//   const name = u.given_name
//     ? `${u.given_name} ${u.family_name ?? ""}`.trim()
//     : u.email ?? null;

//   await prisma.user.upsert({
//     where: { kindeId: u.id },
//     update: { email, name },
//     create: { kindeId: u.id, email, name },
//   });

//   redirect("/dashboard");
// }





// app/auth/after/page.jsx  (Server Component)
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AfterLogin() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/");

  const u = await getUser();

  const email = (u.email ?? "").toLowerCase(); // never undefined for our row
  const name =
    u.given_name || u.family_name
      ? `${u.given_name ?? ""} ${u.family_name ?? ""}`.trim()
      : u.email ?? null;

  await prisma.user.upsert({
    where: { kindeId: u.id },
    update: { email, name },
    create: { kindeId: u.id, email, name },
  });

  redirect("/dashboard");
}