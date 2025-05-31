"use client";

import fetchApi from "@/lib/api/fetchApi";
import { useEffect, useState } from "react";
import Card from "@/lib/components/dashboard/Card";
import { transformURL } from "@/lib/utils/transformURL";

const Collections = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);

	const getCollections = async (status = "draft", category = "") => {
		try {
			const params = {};
			if (status) params.status = status;
			if (category) params.category = category;

			const res = await fetchApi.get("/collection", { params });
			if (res.status === 200) {
				const transformedData = res.data.map((item) => {
					if (item.thumbnail && typeof item.thumbnail === "string") {
						item.thumbnail = transformURL(item.thumbnail);
					}

					if (item.user?.avatar && typeof item.user.avatar === "string") {
						item.user.avatar = transformURL(item.user.avatar);
					}

					return item;
				});

				setCollections(transformedData);
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
