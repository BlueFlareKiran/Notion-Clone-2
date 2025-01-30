import { clerkMiddleware } from "@clerk/nextjs/server";
 
export default clerkMiddleware();
 
// Stop Middleware running on static files and public routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions (.html, .css, .js, etc)
     */
    "/((?!_next|static|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};