"use client";
import { useEffect, useState } from "react";
import QuillEditor from "@/lib/components/QuillEditor";
import { useParams } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";

const CollectionDetail = () => {
	const { uuid } = useParams();
	const [collection, setCollection] = useState(null);

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
		<div className="p-6 ">
			<div className="flex w-full justify-between">
				<div className="bg-white rounded-lg w-full max-w-6xl">
					{/* Quill Editor Container */}
					<div className="mb-4 border rounded-lg">
						<QuillEditor
							value={collection?.content}
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
				<div>halo</div>
			</div>
		</div>
	);
};

export default CollectionDetail;
