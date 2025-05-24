import React from "react";
import Auth from "@/lib/views/auth/Index";

export const metadata = {
	title: "Login - Songolikur",
	description: "Login to Dashboard Songolikur",
	metadataBase: new URL("https://songolikur.vercel.app"),
	openGraph: {
		type: "website",
		url: "https://songolikur.vercel.app/login/",
		title: "Login - Songolikur",
		description: "Login to Dashboard Songolikur",
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
		title: "Login - Songolikur",
		description: "Login to Dashboard Songolikur",
		images: ["/meta.png"],
	},
};

const AuthPage = () => {
	return <Auth />;
};

export default AuthPage;
