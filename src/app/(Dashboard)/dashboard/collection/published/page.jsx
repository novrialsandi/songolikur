import Published from "@/lib/views/dashboard/collection/published/Index";

export const metadata = {
	title: "Published - Songolikur Dashboard",
	description: "Collections Published",
	metadataBase: new URL("https://www.songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.vercel.app/dashboard/collection/published/",
		title: "Published - Songolikur Dashboard",
		description: "Collections Published",
		images: [
			{
				url: "/meta.png",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Published - Songolikur Dashboard",
		description: "Collections Published",
		images: ["/meta.png"],
	},
};

const PublishedPage = () => {
	return <Published />;
};

export default PublishedPage;
