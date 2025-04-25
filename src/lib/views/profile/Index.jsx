"use client";

import React from "react";
import { useSessionStore } from "@/lib/stores";

const Index = () => {
	const { session } = useSessionStore();

	const initial = session?.name?.charAt(0).toUpperCase() || "?";
	const hasAvatar = !!session?.avatar;

	return (
		<div className="h-full flex items-center justify-center bg-gray-50 ">
			<div className="bg-white shadow-md rounded-2xl  w-full max-w-sm text-center p-8">
				{hasAvatar ? (
					<img
						src={session.avatar}
						alt="avatar"
						className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
					/>
				) : (
					<div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
						{initial}
					</div>
				)}

				<h2 className="text-lg font-semibold text-gray-800">
					{session?.name || "No Name"}
				</h2>
				<p className="text-sm text-gray-500">{session?.email || "No Email"}</p>
			</div>
		</div>
	);
};

export default Index;
