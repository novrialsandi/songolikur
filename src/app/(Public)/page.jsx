import { transformURL } from "@/lib/utils/transformURL";
import LandingContent from "@/lib/views/public/Index";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Songolikur - Media To Discover Yogyakarta Culture & Football",
	description: "Discover Yogyakarta Culture & Football",
	metadataBase: new URL("https://www.songolikur.id"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.id/",
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
			console.error(`API request failed with status: ${res.status}`);
			return null;
		}

		const { data } = await res.json();

		if (Array.isArray(data)) {
			data.forEach((item) => {
				if (item.thumbnail && typeof item.thumbnail === "string") {
					item.thumbnail = transformURL(item.thumbnail);
				}
				if (item.user?.avatar && typeof item.user.avatar === "string") {
					item.user.avatar = transformURL(item.user.avatar);
				}
			});
		}

		return data;
	} catch (error) {
		console.error("Error fetching slug data:", error);
		return null;
	}
};

const LandingPage = async () => {
	const data = await getData();

	const collections = data || { collections: [] };

	return (
		<>
			{collections.length > 0 && <LandingContent collections={collections} />}
		</>
	);
};

export default LandingPage;
