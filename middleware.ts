import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PATHS = [
  "/feed",
  "/profile",
  "/settings",
  "/notifications",
  "/admin",
  "/onboarding",
  "/mood",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: Record<string, any>) {
          res.cookies.delete(name, options);
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/mood/:path*",
  ],
};
