"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";
import ReactQuill from "@/lib/components/ReactQuill";
import TextInput from "@/lib/components/TextInput";
import ToggleButton from "@/lib/components/Toogle";
import Dropdown from "@/lib/components/Dropdown";

const CollectionDetail = () => {
	const { uuid } = useParams();
	const [collection, setCollection] = useState(null);
	const [loading, setLoading] = useState(false);

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
			setLoading(true);
			const req = await fetchApi.patch(`/collection/${uuid}`, collection);
			if (req.status === 200) {
				setCollection(req.data);
			}
		} catch (error) {
			console.error("Failed to save content:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6" style={{ height: "calc(100vh - 92px)" }}>
			<div className="flex w-full justify-between gap-6">
				<div className="bg-white rounded-lg w-full max-w-6xl ">
					<ReactQuill
						value={collection?.content || ""}
						uuid={uuid}
						onChange={(newValue) =>
							setCollection((prev) => ({ ...prev, content: newValue }))
						}
					/>
				</div>
				<div className="w-full max-w-[420px] p-4 border">
					<div className="flex flex-col gap-4">
						<div>
							<div>Thumbnail</div>
							<img
								src={collection?.thumbnail || "/placeholder.jpeg"}
								alt="thumbnail"
								className="rounded-md"
							/>
						</div>
						<TextInput label="Title:" />
						<div>
							<div>Category:</div>
							<Dropdown
								items={[
									{ label: "News", value: "news" },
									{ label: "Article", value: "articles" },
								]}
							/>
						</div>
						<div>
							<div>Tags:</div>
							<Dropdown
								items={[
									{ label: "News", value: "news" },
									{ label: "Article", value: "articles" },
								]}
							/>
						</div>
						<ToggleButton label="Anonim:" />
						<button
							onClick={handleSave}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
							disabled={loading}
						>
							{loading ? "Saving..." : "Save Content"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CollectionDetail;
