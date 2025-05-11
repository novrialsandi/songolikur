import Link from "next/link";
import { cookies } from "next/headers";

const LandingPage = async () => {
	const cookieStore = await cookies();
	const cid = cookieStore.get("cid");

	const cookieData = cid ? JSON.parse(cid.value) : null;

	return (
		<div className="w-full h-screen flex justify-center items-center">
			{cookieData ? (
				<Link
					href="/dashboard"
					className="p-2 bg-primary text-white rounded-md"
				>
					Go to Dashboard
				</Link>
			) : (
				<Link href="/login" className="p-2 bg-primary text-white rounded-md">
					Login
				</Link>
			)}
		</div>
	);
};

export default LandingPage;
