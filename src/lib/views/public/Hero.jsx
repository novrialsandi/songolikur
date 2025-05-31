"use client";

import Divider from "@/lib/components/Divider";
import React from "react";
import ArticleCard from "@/lib/components/ArticleCard";

const Hero = ({ collections = [] }) => {
	const repeatedData = [];

	for (let i = 0; i < 5; i++) {
		repeatedData.push(...collections);
	}

	if (!collections || repeatedData.length < 5) return null;

	return (
		<div className="flex md:gap-8 gap-4">
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
