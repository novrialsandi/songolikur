import Draft from "@/lib/views/dashboard/collection/draft/Index";

export const metadata = {
	title: "Draft - Songolikur Dashboard",
	description: "Collections Draft",
	metadataBase: new URL("https://songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://songolikur.vercel.app/dashboard/collection/draft/",
		title: "Draft - Songolikur Dashboard",
		description: "Collections Draft",
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
		title: "Draft - Songolikur Dashboard",
		description: "Collections Draft",
		images: ["/meta.png"],
	},
};

const DraftPage = () => {
	return <Draft />;
};

export default DraftPage;
