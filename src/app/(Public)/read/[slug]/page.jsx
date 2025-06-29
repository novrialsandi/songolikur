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
			console.error(
				`Failed to fetch slug data: ${res.status} ${res.statusText}`
			);
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

	// Fallback values
	const title = data?.title
		? `${data.title} - Songolikur`
		: "Content Not Found - Songolikur";
	const description = data?.seo || "Content Not Found";
	const imageUrl = data?.thumbnail || "https://www.songolikur.id/meta.png";
	const pageUrl = `https://www.songolikur.id/read/${slug}`;

	return {
		title,
		description,
		metadataBase: new URL("https://www.songolikur.id"),
		alternates: {
			canonical: pageUrl,
		},
		openGraph: {
			type: "article", // Changed from "website" to "article" for better SEO
			url: pageUrl,
			title,
			description,
			siteName: "Songolikur",
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: data?.title || "Songolikur Article",
				},
			],
			// Add article-specific OpenGraph tags if data is available
			...(data && {
				publishedTime: data.publishedAt,
				modifiedTime: data.updatedAt,
				authors: [data.user?.name || "Songolikur"],
				section: data.category || "News",
				tags: data.tags || [],
			}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [imageUrl],
			creator: `@${data?.user?.twitter || "songolikur"}`,
			site: "@songolikur",
		},
		// Add robots meta tag
		robots: {
			index: data ? true : false,
			follow: true,
			googleBot: {
				index: data ? true : false,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		// Add additional meta tags
		keywords: data?.tags?.join(", ") || "",
		authors: [{ name: data?.user?.name || "Songolikur" }],
		creator: data?.user?.name || "Songolikur",
		publisher: "Songolikur",
		// Add verification tags if needed
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION,
			yandex: process.env.YANDEX_VERIFICATION,
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

	// Improved JSON-LD structured data
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://www.songolikur.id/read/${slug}`,
		},
		headline: data.title,
		description: data.seo,
		image: {
			"@type": "ImageObject",
			url: data.thumbnail || "https://www.songolikur.id/meta.png",
			width: 1200,
			height: 630,
		},
		datePublished: data.publishedAt,
		dateModified: data.updatedAt || data.publishedAt,
		author: {
			"@type": "Person",
			name: data.user?.name || "Songolikur",
			url:
				data.user?.url ||
				"https://www.songolikur.id/author/" + (data.user?.slug || ""),
		},
		publisher: {
			"@type": "Organization",
			name: "Songolikur",
			logo: {
				"@type": "ImageObject",
				url: "https://www.songolikur.id/meta.png",
				width: 512,
				height: 512,
			},
			url: "https://www.songolikur.id",
		},
		// Add more structured data
		articleSection: data.category || "News",
		keywords: data.tags?.join(", ") || "",
		wordCount: data.content?.length || 0,
		inLanguage: "id-ID",
		isPartOf: {
			"@type": "WebSite",
			name: "Songolikur",
			url: "https://www.songolikur.id",
		},
	};

	// Add breadcrumb structured data
	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://www.songolikur.id",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Read",
				item: "https://www.songolikur.id/read",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: data.title,
				item: `https://www.songolikur.id/read/${slug}`,
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleJsonLd),
				}}
			/>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbJsonLd),
				}}
			/>

			<SlugComponent data={data} slug={slug} />
		</>
	);
};

export default SlugPage;
