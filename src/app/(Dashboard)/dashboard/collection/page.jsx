import Collections from "@/lib/views/dashboard/collection/Index";

export const metadata = {
	title: "Collections - Songolikur Dashboard",
	description: "All Collections",
	metadataBase: new URL("https://www.songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.vercel.app/dashboard/collection/",
		title: "Collections - Songolikur Dashboard",
		description: "All Collections",
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
		title: "Collections - Songolikur Dashboard",
		description: "All Collections",
		images: ["/meta.png"],
	},
};

const CollectionsPage = () => {
	return <Collections />;
};

export default CollectionsPage;
