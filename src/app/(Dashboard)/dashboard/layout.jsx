import React from "react";
import Layout from "@/lib/layout/Index";
import { iconSvg } from "@/lib/Icons/icon";
import { cookies } from "next/headers";

export const metadata = {
	// title: "Dashboard - Songolikur",
	// description: "Text Builder",
	// metadataBase: new URL("https://www.songolikur.id"),
	// openGraph: {
	// 	type: "website",
	// 	url: "https://www.songolikur.id/",
	// 	title: "Songlikur",
	// 	description:
	// 		"Text Builder",
	// 	images: [
	// 		{
	// 			url: "/meta.webp",
	// 			width: 1200,
	// 			height: 630,
	// 		},
	// 	],
	// },
	// twitter: {
	// 	card: "summary_large_image",
	// 	title: "Songlikur",
	// 	description:
	// 		"Text Builder",
	// 	images: ["/meta.webp"],
	// },
};

const DashboardLayout = async ({ children }) => {
	const cookieStore = await cookies();
	const cid = cookieStore.get("cid");

	const cookieData = cid ? JSON.parse(cid.value) : null;

	const menus = {
		menu: [
			{
				name: "Dashboard",
				icon: iconSvg.dashboardSvg,
				href: "/dashboard",
			},
			...(cookieData?.role === "admin"
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
			// {
			// 	name: "All Collections",
			// 	icon: iconSvg.collectionSvg,
			// 	href: "/dashboard/collection",
			// },
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
		// preference: [
		// 	{
		// 		name: "Report",
		// 		icon: iconSvg.laporanSvg,
		// 		// href: "/dashboard/report",
		// 	},
		// 	{
		// 		name: "Setting",
		// 		icon: iconSvg.pengaturanSvg,
		// 		// href: "/dashboard/setting",
		// 	},
		// ],
	};

	return (
		<>
			<Layout menus={menus} cookieData={cookieData}>
				{children}
			</Layout>
		</>
	);
};

export default DashboardLayout;
