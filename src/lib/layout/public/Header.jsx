"use client";

import Button from "@/lib/components/Button";
import Divider from "@/lib/components/Divider";
import TextInput from "@/lib/components/TextInput";
import { iconSvg } from "@/lib/Icons/icon";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderPublic = () => {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [isVisible, setIsVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
							type="search"
							width="w-48"
							value={search}
							placeholder="Search Collection"
							// debounceTime={2000}
							hasIconLeft={iconSvg.search}
							size="small"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const params = new URLSearchParams(window.location.search);
									params.set("search", search);

									router.push(`/read/?${params.toString()}`);
								}
							}}
						/>
					</div>
				</div>
			</div>

			<nav
				className={`fixed top-0 left-0 flex justify-center w-full md:h-20 h-16 bg-[#F7F8FA] border-b border-[#E0E1E4] shadow-md transition-transform duration-300 ease-in-out z-50 ${
					isVisible ? "md:-translate-y-full translate-y-0" : "translate-y-0"
				}`}
			>
				<div className="flex md:px-28 px-4 w-full max-w-[1440px] justify-between items-center h-full">
					{/* Mobile Menu Button */}
					<button
						className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle mobile menu"
					>
						<span
							className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
								isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
							}`}
						></span>
						<span
							className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${
								isMobileMenuOpen ? "opacity-0" : ""
							}`}
						></span>
						<span
							className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
								isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
							}`}
						></span>
					</button>

					{/* Logo */}
					<div className="hidden md:flex gap-8 items-center">
						<Link href="/" className="flex">
							<div>{iconSvg.logoPublicSvg}</div>
						</Link>

						{/* Desktop Menu */}
						<div className="gap-8 flex">
							{menus.map((val, index) => (
								<Link
									href={val.href}
									key={index}
									className="hover:text-blue-600 transition-colors duration-200 font-medium"
								>
									{val.label}
								</Link>
							))}
						</div>
					</div>

					<Link href="/" className="flex">
						<div className="flex md:hidden">{iconSvg.logoMarkSvg}</div>
					</Link>

					<div className="hidden md:block">
						<TextInput
							type="search"
							width="w-48"
							value={search}
							placeholder="Search Collection"
							// debounceTime={2000}
							hasIconLeft={iconSvg.search}
							size="small"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const params = new URLSearchParams(window.location.search);
									params.set("search", search);

									router.push(`/read/?${params.toString()}`);
								}
							}}
						/>
					</div>
				</div>

				{/* Mobile Menu Dropdown */}
				<div
					className={`absolute top-full left-0 w-full bg-[#F7F8FA] shadow-lg border-b border-[#E0E1E4] md:hidden transition-all duration-300 ease-in-out ${
						isMobileMenuOpen
							? "opacity-100 visible transform translate-y-0"
							: "opacity-0 invisible transform -translate-y-2"
					}`}
				>
					<div className="px-4 py-4 space-y-2">
						<TextInput
							type="search"
							width="w-full"
							value={search}
							placeholder="Search Collection"
							// debounceTime={2000}
							hasIconLeft={iconSvg.search}
							size="small"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									setIsMobileMenuOpen(false);
									const params = new URLSearchParams(window.location.search);
									params.set("search", search);

									router.push(`/read/?${params.toString()}`);
								}
							}}
						/>
						{menus.map((val, index) => (
							<Link
								href={val.href}
								key={index}
								className="block py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{val.label}
							</Link>
						))}
					</div>
				</div>
			</nav>

			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/20 bg-opacity-25 z-40 md:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				></div>
			)}

			<Divider />
		</div>
	);
};

export default HeaderPublic;
