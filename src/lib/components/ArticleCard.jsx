import Link from "next/link";
import React from "react";
import Diamond from "./Diamond";

const ArticleCard = ({ item, main }) => {
	return (
		<div className={`flex flex-col ${main ? "gap-4" : "gap-2"}`}>
			<Link
				href={`/read/${item.slug}`}
				className="group overflow-hidden rounded-md"
			>
				<img
					className="aspect-thumbnail object-cover transition-transform duration-300 group-hover:scale-105"
					src={item.thumbnail || "/placeholder.webp"}
					alt={item.title}
				/>
			</Link>

			<div className="flex items-center text-[13px] font-sans uppercase gap-4 text-[#62626D]">
				<div>{item.category}</div>
				<Diamond />
				<div>{item.tag?.[0]}</div>
			</div>

			<Link href={`/read/${item.slug}`}>
				<div className="text-2xl text-border line-clamp-3 hover:underline">
					{item.title}
				</div>
			</Link>

			{main && (
				<div className="font-sans text-[13px] text-[#393C3F]">{item.seo}</div>
			)}

			<div className="text-[12px] flex gap-2 items-center text-border-01">
				<img
					className="size-5 rounded-full"
					src={item.user.avatar || "/avatar.png"}
					alt={item.user.name}
				/>
				<div>{item.user.name}</div>
			</div>
		</div>
	);
};

export default ArticleCard;
