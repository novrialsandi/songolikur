import { NextResponse } from "next/server";

export function middleware(request) {
	const url = request.nextUrl.clone();
	const token = request.cookies.get("sid") || "";
	const userCookie = request.cookies.get("cid");

	let role = "user";
	if (userCookie?.value) {
		try {
			const userData = JSON.parse(userCookie.value);
			role = userData.role || "user";
		} catch (err) {
			console.error("Failed to parse user cookie:", err);
			role = "user";
		}
	}

	// Allow static files and public assets
	if (url.pathname.startsWith("/public") || url.pathname.includes(".")) {
		return NextResponse.next();
	}

	// If user is not logged in and trying to access /dashboard, redirect to /login
	if (!token?.value && url.pathname.includes("/dashboard")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// If user is logged in but doesn't have proper role to access /dashboard
	if (
		token?.value &&
		url.pathname.includes("/dashboard") &&
		!["contributor", "editor", "admin"].includes(role)
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
