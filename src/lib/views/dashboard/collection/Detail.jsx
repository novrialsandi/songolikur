"use client";
import { useEffect, useState } from "react";
import QuillEditor from "@/lib/components/QuillEditor";
import { useParams } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";

const CollectionDetail = () => {
	const { uuid } = useParams();
	const [collection, setCollection] = useState({
		title: "Loading...",
		content: "",
	});

	const getDetail = async () => {
		try {
			const req = await fetchApi.get(`/collection/${uuid}`);
			if (req.status === 200) {
				setCollection(req.data);
			}
		} catch (error) {
			console.error("Failed to fetch collection:", error);
		}
	};

	useEffect(() => {
		if (uuid) {
			getDetail();
		}
	}, [uuid]);

	const handleSave = async () => {
		try {
			const req = await fetchApi.patch(`/collection/${uuid}`, collection);
			if (req.status === 200) {
				setCollection(req.data);
			}
		} catch (error) {
			console.error("Failed to save content:", error);
		}
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">{collection.title}</h2>

				{/* Quill Editor Container */}
				<div className="mb-4 border rounded-lg">
					<QuillEditor
						uuid={uuid}
						onChange={(value) => {
							setCollection((prev) => ({ ...prev, content: value }));
						}}
					/>
				</div>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
					>
						Save Content
					</button>
				</div>
			</div>
		</div>
	);
};

export default CollectionDetail;
