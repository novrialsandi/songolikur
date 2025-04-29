"use client";

import fetchApi from "@/lib/api/fetchApi";
import Button from "@/lib/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Collections = () => {
	const router = useRouter();

	const [newCollection, setNewCollection] = useState({
		title: "New Project",
		content: "",
	});

	const createCollection = async () => {
		const req = await fetchApi.post("/collection", newCollection);

		if (req.status === 201) {
			router.replace(`/dashboard/collection/${req.data.collection_uuid}`);
		}
	};
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<Button className="p-2 rounded-md" onClick={createCollection}>
				New
			</Button>
		</div>
	);
};

export default Collections;
