import React from "react";
import fetchApi from "@/lib/api/fetchApi";
import SlugComponent from "@/lib/views/public/read/slug/Index";

async function getSlugData(slug) {
	try {
		const res = await fetch(
			`${process.env.SERVICE_HOST}/api/collection/public/${slug}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-secret-key": process.env.SECRET_KEY || "",
				},
				cache: "no-store",
			}
		);

		if (!res.ok) {
			return null;
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error("Error fetching slug data:", error);
		return null;
	}
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const data = await getSlugData(slug);

	return {
		title: `${data?.title || "Content Not Found"} - Songolikur`,
		description: data?.seo || "Content Not Found",
		metadataBase: new URL("https://songolikur.vercel.app"),
		openGraph: {
			type: "website",
			url: `https://songolikur.vercel.app/read/${slug}`,
			title: `${data?.title || "Content Not Found"} - Songolikur`,
			description: data?.seo || "Content Not Found",
			images: [
				{
					url: data?.thumbnail || "/meta.png",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${data?.title || "Content Not Found"} - Songolikur`,
			description: data?.seo || "Content Not Found",
			images: [data?.thumbnail || "/meta.png"],
		},
	};
}

const SlugPage = async ({ params }) => {
	const { slug } = await params;
	const data = await getSlugData(slug);

	if (!data) {
		return (
			<div className="p-4 text-center">
				<h1 className="text-xl font-bold">Content Not Found</h1>
				<p>The requested collection could not be found.</p>
			</div>
		);
	}

	return (
		<>
			<SlugComponent data={data} slug={slug} />
		</>
	);
};

export default SlugPage;
