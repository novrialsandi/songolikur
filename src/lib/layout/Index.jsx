"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { iconSvg } from "../Icons/icon";
import { getCookie } from "../helpers/cookie";
import { useSessionStore } from "@/lib/stores";

const Parent = ({ children }) => {
	const { session, setSession } = useSessionStore();
	const pathname = usePathname();
	const [miniSidebar, setMiniSidebar] = useState(false);

	const menus = {
		Menu: [
			{
				name: "Dashboard",
				icon: iconSvg.dashboardSvg,
				href: "/dashboard",
			},
			...(session.role === "admin"
				? [
						{
							name: "User",
							icon: iconSvg.userSvg,
							href: "/dashboard/user",
						},
				  ]
				: []),
		],
		Collection: [
			{
				name: "All Collections",
				icon: iconSvg.collectionSvg,
				href: "/dashboard/collection",
			},
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
		// Preference: [
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

	useLayoutEffect(() => {
		setSession(getCookie("cid"));
	}, []);

	const handleMiniSidebar = (isMini) => {
		setMiniSidebar(isMini);
	};

	const getCurrentPageDetails = () => {
		for (const category in menus) {
			for (const item of menus[category]) {
				if (item.href === pathname) {
					return { name: item.name, subMenu: item.subMenu };
				}
				if (item.subMenu && item.subMenu.href === pathname) {
					return {
						name: item.subMenu.name,
						parent: {
							name: item.name,
							href: item.href,
						},
					};
				}
			}
		}
		return { name: "Dashboard", subMenu: null };
	};

	return (
		<>
			<div className="flex overflow-hidden">
				<Sidebar
					onMiniSidebar={handleMiniSidebar}
					menus={menus}
					miniSidebar={miniSidebar}
				/>
				<div
					className={`w-full pt-23 ${
						miniSidebar ? "ml-20" : "ml-[271px]"
					} transition-all duration-300`}
				>
					<Header
						sidebarWidth={miniSidebar ? "left-20" : "left-[271px]"}
						pageTitle={getCurrentPageDetails().name}
						parentTitle={getCurrentPageDetails().parent?.name}
						parentHref={getCurrentPageDetails().parent?.href}
						subMenu={getCurrentPageDetails().subMenu}
					/>
					{children}
				</div>
			</div>
		</>
	);
};

export default Parent;
