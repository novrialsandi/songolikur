import Dashboard from "@/lib/views/dashboard/Index";

export const metadata = {
	title: "Dashboard - Songolikur Dashboard",
	description: "Dashboard Songolikur",
	metadataBase: new URL("https://www.songolikur.id"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.id/dashboard/",
		title: "Dashboard - Songolikur Dashboard",
		description: "Dashboard Songolikur",
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
		title: "Dashboard - Songolikur Dashboard",
		description: "Dashboard Songolikur",
		images: ["/meta.png"],
	},
};

const DashboardPage = () => {
	return <Dashboard />;
};

export default DashboardPage;
