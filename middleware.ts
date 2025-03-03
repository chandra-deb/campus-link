import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher(['/profile(.*)', ])

// ! This way of protecting routes is a disaster, It goes in to infinite loop.
// const isPublicRoute = createRouteMatcher(['auth/sign-in', '/auth/sign-up'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

// ! Including this line
// if (!isPublicRoute(req)) await auth.protect();

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};