import Link from "next/link";
import { cookies } from "next/headers";

export const metadata = {
	title: "Songolikur",
	description: "",
	// metadataBase: new URL("https://www.songolikur.id"),
	// openGraph: {
	// 	type: "website",
	// 	url: "https://www.songolikur.id/",
	// 	title: "Songlikur",
	// 	description:
	// 		"",
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
	// 	description:
	// 		"",
	// 	images: ["/meta.png"],
	// },
};

const LandingPage = async () => {
	const cookieStore = await cookies();
	const cid = cookieStore.get("cid");

	const cookieData = cid ? JSON.parse(cid.value) : null;

	return (
		<div className="w-full h-screen flex justify-center items-center">
			{cookieData ? (
				<Link
					href="/dashboard"
					className="p-2 bg-primary text-secondary rounded-md"
				>
					Go to Dashboard
				</Link>
			) : (
				<Link
					href="/login"
					className="p-2 bg-primary text-secondary rounded-md"
				>
					Login
				</Link>
			)}
		</div>
	);
};

export default LandingPage;
