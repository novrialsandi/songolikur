import User from "@/lib/views/dashboard/user/Index";

export const metadata = {
	title: "Users - Songolikur Dashboard",
	description: "Users List",
	metadataBase: new URL("https://www.songolikur.id"),
	openGraph: {
		type: "website",
		url: "https://www.songolikur.id/dashboard/user/",
		title: "Users - Songolikur Dashboard",
		description: "Users List",
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
		title: "Users - Songolikur Dashboard",
		description: "Users List",
		images: ["/meta.png"],
	},
};

const UserPage = () => {
	return <User />;
};

export default UserPage;
