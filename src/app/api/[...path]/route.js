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
	const headers = {
		"Content-Type": "application/json",
		"x-secret-key": process.env.SECRET_KEY,
	};

	const authHeader = request.headers.get("authorization");
	if (authHeader) {
		headers.Authorization = authHeader;
	}

	try {
		const body = ["POST", "PUT", "PATCH"].includes(method)
			? await request.json()
			: null;

		const queryString = [...searchParams.entries()]
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join("&");

		const response = await fetch(
			`${apiUrl}${queryString ? `?${queryString}` : ""}`,
			{
				method,
				headers,
				body: body ? JSON.stringify(body) : undefined,
			}
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to ${method} data` },
			{ status: 500 }
		);
	}
}
