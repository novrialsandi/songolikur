"use client";

import fetchApi from "@/lib/api/fetchApi";
import { useEffect, useState } from "react";
import Card from "@/lib/components/dashboard/Card";

const Collections = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);

	const getCollections = async (status = "", category = "") => {
		try {
			const params = {};
			if (status) params.status = status;
			if (category) params.category = category;

			const res = await fetchApi.get("/collection", { params });
			if (res.status === 200) {
				setCollections(res.data);
			}
		} catch (error) {
			console.error("Error fetching collections:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCollections();
	}, []);

	if (loading) {
		return <div className="p-6 text-center">Loading...</div>;
	}

	return (
		<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{collections.map((collection) => (
				<Card
					key={collection.collection_uuid}
					collection={collection}
					onCollectionDelete={(deletedUuid) =>
						setCollections((prev) =>
							prev.filter((col) => col.collection_uuid !== deletedUuid)
						)
					}
				/>
			))}
		</div>
	);
};

export default Collections;
