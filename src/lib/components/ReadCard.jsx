import Link from "next/link";
import React from "react";
import Diamond from "./Diamond";
import moment from "moment";

const ReadCard = ({ item, main }) => {
	return (
		<div
			className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white cursor-pointer`}
		>
			<Link
				href={`/read/${item.slug}`}
				className="block no-underline text-inherit"
			>
				{/* Desktop Layout - Flex Row */}
				<div className="flex flex-col md:flex-row">
					{/* Image Section - Left on Desktop */}
					<div className="relative w-full md:w-80 md:flex-shrink-0 overflow-hidden order-1">
						<img
							src={item.thumbnail || "/placeholder.jpg"}
							alt={item.title}
							className="w-full h-48  object-cover transition-transform duration-300 hover:scale-105"
						/>
						{item.category && (
							<div className="absolute uppercase top-4 left-4 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
								<div>{item.category}</div>
							</div>
						)}
					</div>

					{/* Content Section - Right on Desktop */}
					<div className="flex-1 p-4 md:p-6 order-2">
						<h3
							className={`font-bold leading-tight text-gray-900 mb-3 ${
								main ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
							}`}
						>
							{item.title}
						</h3>

						<div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500 items-center">
							{item.user.name && (
								<>
									<img
										className="size-8 rounded-full"
										src={item.user.avatar || "/avatar.png"}
										alt=""
									/>
									<span className="font-medium text-gray-700">
										By {item.user.name}
									</span>
								</>
							)}
							{item.publishedAt && (
								<span>{moment(item.publishedAt).format("MMMM DD, YYYY")}</span>
							)}
							<span>{item.engagements.views} views</span>
						</div>

						{item.tag && item.tag.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{item.tag.slice(0, 3).map((tag, index) => (
									<span
										key={index}
										className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ReadCard;
