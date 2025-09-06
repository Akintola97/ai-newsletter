"use client";

import Link from "next/link";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserMenu({ user }) {
  if (!user) {
    // Not authenticated → show Sign in (and optional Sign up)
    return (
      <div className="flex items-center gap-2">
        <LoginLink postLoginRedirectURL="/dashboard">
          <Button size="sm">Sign in</Button>
        </LoginLink>
        {/* Optional: */}
        {/* <RegisterLink postLoginRedirectURL="/dashboard">
          <Button size="sm" variant="outline">Sign up</Button>
        </RegisterLink> */}
      </div>
    );
  }

  const initials =
    (user.given_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center rounded-full outline-none focus:ring-2 focus:ring-ring"
          aria-label="Open user menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture ?? undefined} alt={user.given_name ?? "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {user.given_name ? `${user.given_name} ${user.family_name ?? ""}`.trim() : user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>
            Log out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
