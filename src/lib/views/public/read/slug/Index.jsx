"use client";

import fetchApi from "@/lib/api/fetchApi";
import { useEffect } from "react";
import { getCookie, setCookie } from "@/lib/helpers/cookie";
import Divider from "@/lib/components/Divider";
import Diamond from "@/lib/components/Diamond";
import moment from "moment";
import RichTextRenderer from "@/lib/components/RichTextRenderer";

const SlugComponent = ({ data, slug }) => {
	const hitViews = async () => {
		try {
			await fetchApi.patch(`/engagement/view/${slug}`);
		} catch (error) {
			console.error("Error updating view count:", error);
		}
	};

	useEffect(() => {
		const cookieValue = getCookie("viewed_title");
		let viewedSlugs = [];

		try {
			viewedSlugs = cookieValue ? cookieValue : [];
		} catch (error) {
			console.error("Error parsing viewed_title cookie:", error);
			viewedSlugs = [];
		}

		if (!viewedSlugs.includes(slug)) {
			viewedSlugs.push(slug);

			setCookie("viewed_title", viewedSlugs, "nextMonday");

			hitViews();
		}
	}, [slug]);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-6">
			{data.thumbnail && (
				<img
					src={data.thumbnail}
					className="w-full rounded-2xl aspect-thumbnail object-cover"
					alt={data.title || "Article thumbnail"}
				/>
			)}
			<div className="max-w-[740px] space-y-4 flex flex-col items-center">
				<div className="flex w-full justify-between text-[10px] md:text-base font-sans uppercase text-[#62626D]">
					<div className="flex gap-2 md:gap-4 items-center ">
						<div>{data.category}</div>
						<Diamond />
						<div>{data.tag[0]}</div>
					</div>
					<div className="flex gap-2 md:gap-4 items-center">
						<div>{data.engagements.views} views</div>
						<Diamond />
						<div>{moment(data.publishedAt).format("MMMM DD, YYYY")}</div>
					</div>
				</div>
				<div className="text-center font-bold text-2xl md:text-3xl lg:text-4xl">
					{data.title}
				</div>

				<div className="w-2/3 md:w-1/4 flex">
					<Divider />
				</div>
				<div className="flex justify-center font-sans items-center gap-4">
					<img
						className="size-8 rounded-full"
						src={data.user.avatar || "/avatar.png"}
						alt=""
					/>
					<div>
						<div>{data.user.name}</div>
						<div className="text-xs">Journalis</div>
					</div>
				</div>

				<div className="font-sans pt-6">
					{data?.content ? (
						<RichTextRenderer html={data.content} />
					) : (
						<p className="text-gray-500">No content available</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default SlugComponent;
