import Review from "@/lib/views/dashboard/collection/review/Index";

export const metadata = {
	title: "Review - Songolikur Dashboard",
	description: "Collections Review",
	metadataBase: new URL("https://www.songolikur.id"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.id/dashboard/collection/review/",
		title: "Review - Songolikur Dashboard",
		description: "Collections Review",
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
		title: "Review - Songolikur Dashboard",
		description: "Collections Review",
		images: ["/meta.png"],
	},
};

const ReviewPage = () => {
	return <Review />;
};

export default ReviewPage;
