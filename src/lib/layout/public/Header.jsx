"use client";

import Button from "@/lib/components/Button";
import Divider from "@/lib/components/Divider";
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
		<div className=" top-0 bg-white flex flex-col gap-6">
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
						<div>Support us, with</div>
						<Button className="rounded-md" size="small">
							Subsribe
						</Button>
					</div>
					<TextInput
						width="w-48"
						placeholder="Search Article"
						debounceTime={2000}
						hasIconLeft={iconSvg.search}
						size="small"
					/>
				</div>
			</div>

			<Divider />
		</div>
	);
};

export default HeaderPublic;
