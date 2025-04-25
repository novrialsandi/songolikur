"use client";

import { getCookie, removeCookie } from "@/lib/helpers/cookie";
import { useSessionStore } from "@/lib/stores";
import { iconSvg } from "../Icons/icon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useClickOutside } from "../helpers/useClickOutside";

const Layout = ({ children }) => {
	const user = getCookie("cid");
	const router = useRouter();
	const [menus, setMenus] = useState(false);
	const [mobileMenu, setMobileMenu] = useState(false);
	const { session, setSession } = useSessionStore();
	const ref = useClickOutside(() => setMenus(false));
	const mobileRef = useClickOutside(() => setMobileMenu(false));

	useEffect(() => {
		setSession(user);
	}, []);

	const handleLogout = () => {
		removeCookie("sid");
		removeCookie("cid");
		setMenus(false);
		setMobileMenu(false);
		router.replace("/login");
	};

	const navigateToProfile = () => {
		router.replace("/profile");
		setMenus(false);
		setMobileMenu(false);
	};

	return (
		<div className="">
			{/* Header */}
			<div className="h-16 bg-primary w-full flex items-center justify-between px-4 md:px-8 lg:px-20 shadow-xl">
				{/* Left side - Logo/Home */}
				<div
					className="font-bold text-white cursor-pointer"
					onClick={() => router.replace("/")}
				>
					Home
				</div>

				{/* Mobile menu button - only visible on small screens */}
				<div className="block md:hidden">
					<button
						className="text-white p-2"
						onClick={() => setMobileMenu(!mobileMenu)}
						aria-label="Menu"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				{/* Desktop user profile - hidden on mobile */}
				<div className="hidden md:flex min-w-[180px] lg:min-w-[245px] relative h-full items-center text-white justify-center gap-2 border-l-2 border-black/10 px-4 lg:px-8">
					<div>{iconSvg.profile}</div>
					<div>
						<div
							className="font-bold flex items-center gap-2 cursor-pointer"
							onClick={() => setMenus(!menus)}
						>
							<div className="truncate max-w-[120px] lg:max-w-full">
								{session.name || "User"}
							</div>
							<div>{iconSvg.arrow}</div>
						</div>
						<div className="text-[12px]">Sales Lead</div>
					</div>
					{menus && (
						<div
							ref={ref}
							className="absolute top-16 right-0 flex flex-col rounded-b-md gap-2 bg-primary p-2 w-full z-50"
						>
							<div
								className="p-2 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"
								onClick={navigateToProfile}
							>
								Profile
							</div>
							<div
								className="p-2 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"
								onClick={handleLogout}
							>
								Logout
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Mobile menu - only visible when opened */}
			{mobileMenu && (
				<div
					ref={mobileRef}
					className="block md:hidden absolute top-16 right-0 left-0 bg-primary z-50 shadow-lg"
				>
					<div className="flex flex-col p-4 text-white">
						<div className="flex items-center gap-2 py-3 border-b border-white/20">
							<div>{iconSvg.profile}</div>
							<div>
								<div className="font-bold">{session.name || "User"}</div>
								<div className="text-[12px]">Sales Lead</div>
							</div>
						</div>
						<div
							className="py-3 hover:bg-white/10 cursor-pointer"
							onClick={navigateToProfile}
						>
							Profile
						</div>
						<div
							className="py-3 hover:bg-white/10 cursor-pointer"
							onClick={handleLogout}
						>
							Logout
						</div>
					</div>
				</div>
			)}

			{/* Main content */}
			<div className="bg-[#f2f2f2] h-[calc(100vh-64px)] overflow-auto">
				{children}
			</div>
		</div>
	);
};

export default Layout;
