import Read from "@/lib/views/public/read/Index";

export const metadata = {
	title: "Read Collections - Songolikur",
	description: "Read Collections Songolikur",
	metadataBase: new URL("https://songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://songolikur.vercel.app/read/",
		title: "Read Collections - Songolikur",
		description: "Read Collections Songolikur",
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
		title: "Read Collections - Songolikur",
		description: "Read Collections Songolikur",
		images: ["/meta.png"],
	},
};

const ReadPage = () => {
	return (
		<>
			<Read />
		</>
	);
};
export default ReadPage;
