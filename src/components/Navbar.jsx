// // import React from 'react'
// // import Link from 'next/link'
// // import { ModeToggle } from './modeToggle'

// // const Navbar = () => {
// //   return (
// //      <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-2 z-50 font-poppins capitalize">
// //       <div className="flex items-center text-white p-3">
// //         <Link href="/">
// //           <h1 className="font-bold">Newsletter</h1>
// //         </Link>
// //       </div>
// //       <div className="flex items-center space-x-4">
// //         <ModeToggle />
// //       </div>
// //     </nav>
// //   )
// // }

// // export default Navbar




// // components/Navbar.jsx
// import Link from "next/link";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { ModeToggle } from "./modeToggle";
// import UserMenu from "./UserMenu"; // client component below

// export default async function Navbar() {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser(); // null if not signed in

//   return (
//     <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="mx-auto flex h-full items-center justify-between px-4">
//         <Link href="/" className="font-semibold tracking-tight">
//           Newsletter
//         </Link>

//         <div className="flex items-center gap-2">
//           <ModeToggle />
//           <UserMenu user={user} />
//         </div>
//       </div>
//     </nav>
//   );
// }





import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ModeToggle } from "./modeToggle";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authed = await isAuthenticated();
  const user = authed ? await getUser() : null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Link href={authed ? "/dashboard" : "/"} prefetch={false} className="font-semibold tracking-tight">
          Newsletter
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  );
}