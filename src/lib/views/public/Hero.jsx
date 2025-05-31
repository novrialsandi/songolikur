"use client";

import Divider from "@/lib/components/Divider";
import React from "react";
import Link from "next/link";
import Diamond from "@/lib/components/Diamond";
import ArticleCard from "@/lib/components/ArticleCard";

const Hero = ({ collections }) => {
	const repeatedData = [];

	for (let i = 0; i < 5; i++) {
		repeatedData.push(...collections); // Spread to flatten
	}

	if (!collections || repeatedData.length < 5) return null;

	return (
		<div className="flex md:gap-8 gap-4">
			{/* Left Column */}
			<div className="flex flex-col md:gap-4 gap-2 w-1/4">
				<ArticleCard item={repeatedData[1]} />
				<ArticleCard item={repeatedData[2]} />
			</div>

			{/* Center Column */}
			<Divider orientation="vertical" />

			<div className="flex flex-col md:gap-6 gap-4 w-2/4">
				<div className="flex flex-col md:gap-4 gap-2">
					<Link
						href={`/read/${repeatedData[0].slug}`}
						className="group overflow-hidden rounded-md"
					>
						<img
							className="aspect-thumbnail object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
							src={repeatedData[0].thumbnail || "/placeholder.webp"}
							alt={repeatedData[0].title}
						/>
					</Link>

					<div className="flex items-center text-[13px] font-sans uppercase gap-4 text-[#62626D]">
						<div>{repeatedData[0].category}</div>
						<Diamond />
						<div>{repeatedData[0].tag?.[0]}</div>
					</div>

					<Link href={`/read/${repeatedData[0].slug}`}>
						<div className="text-2xl text-border hover:underline">
							{repeatedData[0].title}
						</div>
					</Link>

					<div className="font-sans text-[13px] text-[#393C3F]">
						{repeatedData[0].seo}
					</div>

					<div className="text-[12px] flex gap-2 items-center text-border-01">
						<img
							className="size-5 rounded-full"
							src={repeatedData[0].user.avatar || "/avatar.png"}
							alt={repeatedData[0].user.name}
						/>
						<div>{repeatedData[0].user.name}</div>
					</div>
				</div>
			</div>

			{/* Right Column */}
			<Divider orientation="vertical" />

			<div className="flex flex-col md:gap-4 gap-2 w-1/4">
				<ArticleCard item={repeatedData[3]} />
				<ArticleCard item={repeatedData[4]} />
			</div>
		</div>
	);
};

export default Hero;
