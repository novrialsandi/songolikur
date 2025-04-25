import { NextResponse } from "next/server";

export function middleware(request) {
	const url = request.nextUrl.clone();

	// Ignore requests for static files
	if (url.pathname.startsWith("/public") || url.pathname.includes(".")) {
		return NextResponse.next();
	}

	const token = request.cookies.get("sid") || "";

	// List of public routes that don't require authentication
	const publicRoutes = ["/login", "/register", "/forgot-password"];

	// Redirect authenticated users away from public routes
	if (token.value && publicRoutes.includes(url.pathname)) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Redirect unauthenticated users to the login page
	if (!token.value && !publicRoutes.includes(url.pathname)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
