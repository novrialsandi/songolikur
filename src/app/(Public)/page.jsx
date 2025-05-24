import Link from "next/link";
import { cookies } from "next/headers";
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

const LandingPage = async () => {
	const cookieStore = await cookies();
	const cid = cookieStore.get("cid");

	const cookieData = cid ? JSON.parse(cid.value) : null;

	return (
		<>
			<LandingContent />
			{/* <div className="w-full h-screen flex justify-center items-center">
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
			</div> */}
		</>
	);
};

export default LandingPage;
