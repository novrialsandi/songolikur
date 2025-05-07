"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { iconSvg } from "../Icons/icon";

const Parent = ({ children }) => {
	const pathname = usePathname();
	const router = useRouter();
	const [miniSidebar, setMiniSidebar] = useState(false);

	const [menus] = useState({
		Data: [
			{
				name: "Dashboard",
				icon: iconSvg.dasborSvg,
				isNotif: false,
				href: "/dashboard",
			},
			{
				name: "User",
				icon: iconSvg.pelangganSvg,
				isNotif: false,
				// href: "/dashboard/user",
			},
		],
		Collection: [
			{
				name: "All Collections",
				icon: iconSvg.laporanSvg,
				isNotif: false,
				href: "/dashboard/collection",
			},
			{
				name: "Draft",
				icon: iconSvg.laporanSvg,
				isNotif: false,
				// href: "/dashboard/collection/draft",
			},
			{
				name: "Review",
				icon: iconSvg.laporanSvg,
				isNotif: false,
				// href: "/dashboard/collection/review",
			},
		],
		Preference: [
			{
				name: "Report",
				icon: iconSvg.laporanSvg,
				isNotif: false,
				// href: "/dashboard/report",
			},
			{
				name: "Setting",
				icon: iconSvg.pengaturanSvg,
				isNotif: false,
				// href: "/dashboard/setting",
			},
		],
	});

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

	const pageDetails = getCurrentPageDetails();

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
						pageTitle={pageDetails.name}
						parentTitle={pageDetails.parent?.name}
						parentHref={pageDetails.parent?.href}
						subMenu={pageDetails.subMenu}
					/>
					{children}
				</div>
			</div>
		</>
	);
};

export default Parent;
