"use client";

import fetchApi from "@/lib/api/fetchApi";
import { useEffect } from "react";
import DOMPurify from "dompurify";
import { getCookie, setCookie } from "@/lib/helpers/cookie";

const SlugComponent = ({ data, slug }) => {
	const sanitizedContent =
		typeof window !== "undefined"
			? DOMPurify.sanitize(data.content)
			: data.content;

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

			setCookie("viewed_title", viewedSlugs);

			hitViews();
		}
	}, [slug]);

	return (
		<div className="p-6 w-full flex justify-center">
			<div className="max-w-3xl">
				{data.thumbnail && (
					<img src={data.thumbnail} alt={data.title || "Article thumbnail"} />
				)}
				<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
			</div>
		</div>
	);
};

export default SlugComponent;
