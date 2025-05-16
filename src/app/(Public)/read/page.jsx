import Read from "@/lib/views/public/read/Index";

export const metadata = {
	title: "Read - Songolikur",
	description: "Read Songolikur",
	// metadataBase: new URL("https://www.songolikur.id"),
	// openGraph: {
	// 	type: "website",
	// 	url: "https://www.songolikur.id/read/",
	// 	title: "Songlikur",
	// 	description: "Read - Songolikur",
	// 	images: [
	// 		{
	// 			url: "/meta.png",
	// 			width: 1200,
	// 			height: 630,
	// 		},
	// 	],
	// },
	// twitter: {
	// 	card: "summary_large_image",
	// 	title: "Songlikur",
	// 	description: "Read - Songolikur",
	// 	images: ["/meta.png"],
	// },
};

const ReadPage = () => {
	return (
		<>
			<Read />
		</>
	);
};
export default ReadPage;
