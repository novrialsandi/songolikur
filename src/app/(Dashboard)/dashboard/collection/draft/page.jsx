import Draft from "@/lib/views/dashboard/collection/draft/Index";

export const metadata = {
	title: "Songolikur - Draft",
	description: "Text Builder",
	// metadataBase: new URL("https://www.songolikur.id"),
	// openGraph: {
	// 	type: "website",
	// 	url: "https://www.songolikur.id/",
	// 	title: "Songlikur",
	// 	description:
	// 		"Text Builder",
	// 	images: [
	// 		{
	// 			url: "/meta.webp",
	// 			width: 1200,
	// 			height: 630,
	// 		},
	// 	],
	// },
	// twitter: {
	// 	card: "summary_large_image",
	// 	title: "Songlikur",
	// 	description:
	// 		"Text Builder",
	// 	images: ["/meta.webp"],
	// },
};

const DraftPage = () => {
	return <Draft />;
};

export default DraftPage;
