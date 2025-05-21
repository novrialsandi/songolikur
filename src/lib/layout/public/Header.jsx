"use client";

import Button from "@/lib/components/Button";
import TextInput from "@/lib/components/TextInput";
import { iconSvg } from "@/lib/Icons/icon";
import moment from "moment";
import Link from "next/link";

const HeaderPublic = () => {
	const menus = [
		{
			name: "Info",
			href: "/",
		},
		{
			name: "Talks",
			href: "/",
		},
		{
			name: "Speakers",
			href: "/",
		},
		{
			name: "Sponsors",
			href: "/",
		},
	];
	return (
		<div className="flex flex-col justify-between gap-6">
			<div className="flex justify-between h-[105px]">
				<div className="w-1/3 flex flex-col items-start justify-between max-w-60">
					<div className="text-[#393C3F] text-[13px] h-8 items-center flex">
						{moment().format("dddd, MMMM YYYY")}
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
								{val.name}
							</Link>
						))}
					</div>
				</div>
				<div className="w-1/3 flex flex-col items-end justify-between max-w-60">
					<div className="flex gap-4 items-center h-8">
						{/* <div>Support us, with</div>
						<Button className="rounded-md" size="small">
							Subsribe
						</Button> */}
					</div>
					<TextInput
						width="w-52"
						placeholder="Search Article"
						debounceTime={2000}
						hasIconLeft={iconSvg.search}
						size="small"
					/>
				</div>
			</div>
			<div className="w-full flex items-center gap-4">
				<div className="w-full border-t border-[#E0E1E4]"></div>
				<div className="min-h-2 min-w-2 bg-[#E0E1E4] rotate-45 border border-[#E0E1E4]"></div>
				<div className="w-full border-t border-[#E0E1E4]"></div>
			</div>
		</div>
	);
};

export default HeaderPublic;
