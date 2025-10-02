// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

// export const GET = handleAuth();

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = async (req) => {
  // Call it inside the handler so it runs at runtime, not at build
  return handleAuth()(req);
};
