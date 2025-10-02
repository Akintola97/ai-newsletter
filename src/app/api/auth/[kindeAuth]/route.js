// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

// export const GET = handleAuth();

// app/api/auth/[kindeAuth]/route.js
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req, context) {
  const authHandler = handleAuth();
  return authHandler(req, context);
}

export async function POST(req, context) {
  const authHandler = handleAuth();
  return authHandler(req, context);
}
