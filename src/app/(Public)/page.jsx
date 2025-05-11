import Link from "next/link";
import React from "react";

const LandingPage = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<Link href="/dashboard" className="p-2 bg-primary text-white rounded-md">
				Go to Dashboard
			</Link>
		</div>
	);
};

export default LandingPage;
