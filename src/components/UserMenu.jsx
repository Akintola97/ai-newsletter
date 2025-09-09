// "use client";

// import Link from "next/link";
// import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// export default function UserMenu({ user }) {
//   if (!user) {
//     // Not authenticated → show Sign in (and optional Sign up)
//     return (
//       <div className="flex items-center gap-2">
//         <LoginLink postLoginRedirectURL="/dashboard">
//           <Button size="sm">Sign in</Button>
//         </LoginLink>
//       </div>
//     );
//   }

//   const initials =
//     (user.given_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button
//           className="inline-flex items-center rounded-full outline-none focus:ring-2 focus:ring-ring"
//           aria-label="Open user menu"
//         >
//           <Avatar className="h-8 w-8">
//             <AvatarImage src={user.picture ?? undefined} alt={user.given_name ?? "User"} />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-56">
//         <DropdownMenuLabel className="truncate">
//           {user.given_name ? `${user.given_name} ${user.family_name ?? ""}`.trim() : user.email}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild>
//           <Link href="/dashboard">Dashboard</Link>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild>
//           <LogoutLink>
//             Log out
//           </LogoutLink>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }



"use client";

import Link from "next/link";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/** Build two-letter initials: given+family → name → email local-part */
function getInitials(user) {
  const first =
    user?.given_name ??
    user?.name?.split(" ")?.[0] ??
    user?.email?.split("@")?.[0] ??
    "User";
  const last =
    user?.family_name ??
    (user?.name ? user.name.split(" ").slice(-1)[0] : "") ??
    "";
  const f = (first?.[0] ?? "U").toUpperCase();
  const l = (last?.[0] ?? (user?.name ? "" : (user?.email?.[1] ?? ""))).toUpperCase();
  return (f + l).slice(0, 2);
}

export default function UserMenu({ user }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <LoginLink postLoginRedirectURL="/dashboard">
          <Button size="sm">Sign in</Button>
        </LoginLink>
      </div>
    );
  }

  const initials = getInitials(user);
  const displayName = user.given_name
    ? `${user.given_name} ${user.family_name ?? ""}`.trim()
    : user.name ?? user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center rounded-full outline-none focus:ring-2 focus:ring-ring"
          aria-label="Open user menu"
          title={displayName}
        >
          {/* Initials badge (no image) */}
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-medium">
            {initials}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
