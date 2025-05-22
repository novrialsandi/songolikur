"use client";

import Button from "@/lib/components/Button";
import Divider from "@/lib/components/Divider";
import TextInput from "@/lib/components/TextInput";
import { iconSvg } from "@/lib/Icons/icon";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderPublic = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const menus = [
		{
			label: "Info",
			href: "/",
		},
		{
			label: "Talks",
			href: "/",
		},
		{
			label: "Speakers",
			href: "/",
		},
		{
			label: "Sponsors",
			href: "/",
		},
	];

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const controlNavbar = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", controlNavbar);

		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, []);

	return (
		<div className=" bg-white flex flex-col gap-6">
			<div
				className={`transition-all duration-300 md:block hidden ease-in-out ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-full"
				}`}
			>
				<div className="flex justify-between h-[105px]">
					<div className="w-1/3 flex flex-col items-start justify-between max-w-60">
						<div className="text-[#393C3F] text-[13px] h-8 items-center flex">
							{moment().format("dddd, MMMM Do YYYY")}
						</div>
						<div className="font-semibold">
							Media To Discover Yogyakarta Culture & Football
						</div>
					</div>
					<div className="w-1/3 flex flex-col items-center justify-between max-w-64">
						<Link href={"/"}>{iconSvg.logoPublicSvg}</Link>
						<div className="flex w-full justify-between">
							{menus.map((val, index) => (
								<Link href={val.href} key={index}>
									{val.label}
								</Link>
							))}
						</div>
					</div>
					<div className="w-1/3 flex flex-col items-end justify-between max-w-60">
						<div className="flex gap-4 items-center h-8">
							<div>Support us, with</div>
							<Button className="rounded-md" size="small">
								Subscribe
							</Button>
						</div>
						<TextInput
							width="w-48"
							placeholder="Search Collection"
							debounceTime={2000}
							hasIconLeft={iconSvg.search}
							size="small"
						/>
					</div>
				</div>
			</div>

			{/* Sticky navigation bar that appears when scrolling */}
			<nav
				className={`fixed  top-0 left-0 flex justify-center w-full h-20 bg-[#F7F8FA] border-b-[#E0E1E4] shadow-md transition-transform duration-300 ease-in-out z-50 ${
					!isVisible ? "translate-y-0" : "-translate-y-full"
				}`}
			>
				<div className="flex md:px-28 px-4 w-full max-w-[1440px] justify-between items-center h-full gap-8">
					<Link href={"/"}>{iconSvg.logoPublicSvg}</Link>
					<div className="flex gap-8">
						{menus.map((val, index) => (
							<Link
								href={val.href}
								key={index}
								className="hover:text transition-colors duration-200"
							>
								{val.label}
							</Link>
						))}
					</div>
				</div>
			</nav>

			<Divider />
		</div>
	);
};

export default HeaderPublic;
