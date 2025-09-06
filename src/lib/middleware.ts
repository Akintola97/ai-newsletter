import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth({ isReturnToCurrentPage: false });

export const config = {
  matcher: ["/dashboard/:path*", "/api/preferences/:path*"], // no "/"
};