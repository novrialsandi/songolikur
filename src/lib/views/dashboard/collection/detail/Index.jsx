"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";
import ReactQuill from "@/lib/components/ReactQuill";
import DetailsForm from "./DetailsForm";
import { useSessionStore } from "@/lib/stores";
import DOMPurify from "dompurify";

const CollectionDetail = () => {
	const { uuid } = useParams();
	const { session } = useSessionStore();
	const [collection, setCollection] = useState({});
	const [loading, setLoading] = useState(false);
	const [detailLoading, setDetailLoading] = useState(true);

	const getDetail = async () => {
		try {
			setDetailLoading(true);
			const req = await fetchApi.get(`/collection/${uuid}`);
			if (req.status === 200) {
				setCollection(req.data);
			}
		} catch (error) {
			console.error("Failed to fetch collection:", error);
		} finally {
			setDetailLoading(false);
		}
	};

	useEffect(() => {
		if (uuid) {
			getDetail();
		}
	}, [uuid]);

	if (detailLoading) {
		return (
			<div className="text-center text-gray-500 py-8">Loading content...</div>
		);
	}

	if (
		collection.status === "published" ||
		(collection.status === "review" &&
			collection.editor_uuid !== session.user_uuid)
	) {
		const sanitizedContent = DOMPurify.sanitize(collection.content);

		return (
			<div className="p-6 w-full flex justify-center">
				<div className="max-w-3xl">
					<img src={collection.thumbnail} alt="" />
					<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
				</div>
			</div>
		);
	}

	return (
		<div className="p-6" style={{ height: "calc(100vh - 92px)" }}>
			<div className="flex w-full justify-center gap-6">
				<ReactQuill
					value={collection?.content || ""}
					uuid={uuid}
					onChange={(newValue) =>
						setCollection((prev) => ({ ...prev, content: newValue }))
					}
				/>

				<DetailsForm
					collection={collection}
					setCollection={setCollection}
					loading={loading}
					setLoading={setLoading}
					uuid={uuid}
				/>
			</div>
		</div>
	);
};

export default CollectionDetail;
