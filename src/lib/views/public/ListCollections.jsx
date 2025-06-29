"use client";

import Link from "next/link";
import React from "react";

const ListCollections = ({ collections = [] }) => {
	if (collections < 5) return null;

	return (
		<div className="md:flex flex-col gap-4 hidden">
			{collections.slice(6, 10).map((val, index) => {
				return (
					<Link
						href={`/read/${val.slug}`}
						key={index}
						className="h-full border border-[#cccccc] rounded-xl flex gap-4 p-4"
					>
						<img
							src={val.thumbnail}
							className="size-48 object-cover rounded-lg"
							alt=""
						/>
						<div className="text-3xl">{val.title}</div>
					</Link>
				);
			})}
			<div className="flex justify-end">
				<Link href={"/read"}>Show more</Link>
			</div>
		</div>
	);
};

export default ListCollections;
