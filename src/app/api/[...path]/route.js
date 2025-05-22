// app/api/[...path]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	return requestHandle("GET", request, params);
}

export async function POST(request, { params }) {
	return requestHandle("POST", request, params);
}

export async function PUT(request, { params }) {
	return requestHandle("PUT", request, params);
}

export async function PATCH(request, { params }) {
	return requestHandle("PATCH", request, params);
}

export async function DELETE(request, { params }) {
	return requestHandle("DELETE", request, params);
}

async function requestHandle(method, request, params) {
	const awaitedParams = await params;
	const path = awaitedParams.path || [];
	const { searchParams } = new URL(request.url);
	const apiUrl = `${process.env.SERVICE_HOST}/api/${path.join("/")}`;

	// Get content type from the original request
	const contentType = request.headers.get("content-type") || "";

	const headers = {
		"x-secret-key": process.env.SECRET_KEY,
	};

	// Only set Content-Type for JSON requests
	if (contentType.includes("application/json")) {
		headers["Content-Type"] = "application/json";
	}

	const authHeader = request.headers.get("authorization");
	if (authHeader) {
		headers.Authorization = authHeader;
	}

	try {
		let body = null;

		if (["POST", "PUT", "PATCH"].includes(method)) {
			if (contentType.includes("application/json")) {
				// Handle JSON data
				body = JSON.stringify(await request.json());
			} else if (
				contentType.includes("multipart/form-data") ||
				contentType.includes("image/")
			) {
				// Handle FormData (including file uploads)
				body = await request.formData();
			} else if (contentType.includes("application/x-www-form-urlencoded")) {
				// Handle form data
				body = await request.text();
				headers["Content-Type"] = "application/x-www-form-urlencoded";
			} else {
				// Handle other binary data (raw image uploads)
				body = await request.arrayBuffer();
				if (contentType) {
					headers["Content-Type"] = contentType;
				}
			}
		}

		const queryString = [...searchParams.entries()]
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join("&");

		const fetchOptions = {
			method,
			headers,
		};

		// Only add body if it exists and handle different body types
		if (body !== null) {
			if (body instanceof FormData) {
				// For FormData, don't set Content-Type header (let fetch set it with boundary)
				delete headers["Content-Type"];
				fetchOptions.body = body;
			} else if (body instanceof ArrayBuffer) {
				fetchOptions.body = body;
			} else {
				fetchOptions.body = body;
			}
		}

		const response = await fetch(
			`${apiUrl}${queryString ? `?${queryString}` : ""}`,
			fetchOptions
		);

		// Handle both JSON and non-JSON responses
		const responseContentType = response.headers.get("content-type") || "";
		let data;

		if (responseContentType.includes("application/json")) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error(`Error in ${method} request:`, error);
		return NextResponse.json(
			{ error: `Failed to ${method} data: ${error.message}` },
			{ status: 500 }
		);
	}
}
