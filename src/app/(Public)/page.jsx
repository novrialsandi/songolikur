import LandingContent from "@/lib/views/public/Index";

export const metadata = {
	title: "Songolikur - Media To Discover Yogyakarta Culture & Football",
	description: "Discover Yogyakarta Culture & Football",
	metadataBase: new URL("https://songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://songolikur.vercel.app/",
		title: "Songolikur - Media To Discover Yogyakarta Culture & Football",
		description: "Discover Yogyakarta Culture & Football",
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
		title: "Songolikur - Media To Discover Yogyakarta Culture & Football",
		description: "Discover Yogyakarta Culture & Football",
		images: ["/meta.png"],
	},
};

const getData = async () => {
	try {
		const res = await fetch(
			`${process.env.SERVICE_HOST}/api/collection/public`,
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
};

const LandingPage = async () => {
	const data = await getData();

	return (
		<>
			<LandingContent collections={data} />
		</>
	);
};

export default LandingPage;
