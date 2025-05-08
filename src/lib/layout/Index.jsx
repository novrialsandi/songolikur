"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSessionStore } from "@/lib/stores";

const Parent = ({ children, menus, cookieData }) => {
	const { setSession } = useSessionStore();
	const pathname = usePathname();
	const [miniSidebar, setMiniSidebar] = useState(false);

	useEffect(() => {
		setSession(cookieData);
	}, []);

	const handleMiniSidebar = (isMini) => {
		setMiniSidebar(isMini);
	};

	const getCurrentPageDetails = () => {
		const uuidPattern = /^\/dashboard\/collection\/\d+$/;

		if (uuidPattern.test(pathname)) {
			return { name: "Text Editor", subMenu: null };
		}

		for (const category in menus) {
			for (const item of menus[category]) {
				if (item.href === pathname) {
					return { name: item.name, subMenu: item.subMenu };
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
					/>
					{children}
				</div>
			</div>
		</>
	);
};

export default Parent;
