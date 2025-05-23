"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useCollectionSelectedStore, useSessionStore } from "@/lib/stores";
import { setCookie, removeCookie } from "../helpers/cookie";

const Parent = ({ children, menus, cookieData, status }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { setSession } = useSessionStore();
	const { collectionSelected } = useCollectionSelectedStore();

	const [miniSidebar, setMiniSidebar] = useState(false);

	useEffect(() => {
		if (status === 401 || status === 403) {
			removeCookie("sid");
			removeCookie("cid");
			setSession({});

			router.push("/login");
		} else {
			setCookie("cid", cookieData, "nextMonday");
			setSession(cookieData);
		}
	}, [status]);

	const handleMiniSidebar = (isMini) => {
		setMiniSidebar(isMini);
	};

	const getCurrentPageDetails = () => {
		const uuidPattern = /^\/dashboard\/collection\/\d+$/;

		if (uuidPattern.test(pathname)) {
			return { name: collectionSelected, subMenu: null };
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
			<div className="flex overflow-hidden bg-white">
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
