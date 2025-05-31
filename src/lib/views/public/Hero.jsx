"use client";

import Divider from "@/lib/components/Divider";
import React from "react";
import ArticleCard from "@/lib/components/ArticleCard";
import Link from "next/link";

const Hero = ({ collections = [] }) => {
	const repeatedData = [];

	for (let i = 0; i < 5; i++) {
		repeatedData.push(...collections);
	}

	if (!collections || repeatedData.length < 5) return null;

	return (
		<>
			{/* Desktop View */}
			<div className="space-y-6">
				<div className="md:flex hidden md:gap-8 gap-4">
					{/* Left Column */}
					<div className="flex flex-col md:gap-4 gap-2 w-1/4">
						<ArticleCard item={repeatedData[1]} />
						<ArticleCard item={repeatedData[2]} />
					</div>

					<Divider orientation="vertical" />

					{/* Center Column */}
					<div className="flex flex-col md:gap-6 gap-4 w-2/4">
						<ArticleCard item={repeatedData[0]} main={true} />
					</div>

					<Divider orientation="vertical" />

					{/* Right Column */}
					<div className="flex flex-col md:gap-4 gap-2 w-1/4">
						<ArticleCard item={repeatedData[3]} />
						<ArticleCard item={repeatedData[4]} />
					</div>
				</div>
			</div>

			{/* Mobile View */}
			<div className="md:hidden flex flex-col gap-4">
				<div>
					<div>Latest</div>
					<ArticleCard item={repeatedData[0]} />
				</div>
				<Divider />

				{repeatedData.slice(1, 5).map((val, index) => {
					return (
						<Link
							href={`/read/${val.slug}`}
							key={index}
							className="flex flex-col gap-4"
						>
							<div className="flex items-center gap-4 max-h-20">
								<img
									src={val.thumbnail}
									alt=""
									className="size-20 rounded-md object-cover"
								/>
								<div>{val.title}</div>
							</div>
							<Divider />
						</Link>
					);
				})}

				<div className="flex justify-end">
					<Link href={"/read"}>Show more</Link>
				</div>
			</div>
		</>
	);
};

export default Hero;
