import React from "react";
import Layout from "@/lib/layout/Index";
import { iconSvg } from "@/lib/Icons/icon";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const getMe = async () => {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("sid")?.value;

		const res = await fetch(`${process.env.SERVICE_HOST}/api/user/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-secret-key": process.env.SECRET_KEY || "",
				Authorization: token ? `Bearer ${token}` : "",
			},
			cache: "no-store",
		});

		// Jika token tidak valid atau expired
		if (res.status === 401 || res.status === 403) {
			cookieStore.delete("sid");
			cookieStore.delete("cid");
			return { status: res.status, user: null };
		}

		if (!res.ok) {
			return { status: res.status, user: null };
		}

		const data = await res.json();

		return { status: 200, user: data.user };
	} catch (error) {
		console.error("Error fetching user data:", error);
		return { status: 500, user: null };
	}
};

const DashboardLayout = async ({ children }) => {
	const { status, user } = await getMe();

	const menus = {
		menu: [
			{
				name: "Dashboard",
				icon: iconSvg.dashboardSvg,
				href: "/dashboard",
			},
			...(user?.role === "admin"
				? [
						{
							name: "User",
							icon: iconSvg.userSvg,
							href: "/dashboard/user",
						},
				  ]
				: []),
		],
		collection: [
			{
				name: "Published",
				icon: iconSvg.publichedSvg,
				href: "/dashboard/collection/published",
			},
			{
				name: "Draft",
				icon: iconSvg.draftSvg,
				href: "/dashboard/collection/draft",
			},
			{
				name: "Review",
				icon: iconSvg.reviewSvg,
				href: "/dashboard/collection/review",
			},
		],
	};

	return (
		<>
			<Layout menus={menus} cookieData={user} status={status}>
				{children}
			</Layout>
		</>
	);
};

export default DashboardLayout;
