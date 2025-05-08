"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";
import ReactQuill from "@/lib/components/ReactQuill";
import TextInput from "@/lib/components/TextInput";
import ToggleButton from "@/lib/components/Toogle";
import Dropdown from "@/lib/components/Dropdown";
import Button from "@/lib/components/Button";
import { iconSvg } from "@/lib/Icons/icon";

const CollectionDetail = () => {
	const { uuid } = useParams();
	const [collection, setCollection] = useState({});
	const [loading, setLoading] = useState(false);
	const [quillLoading, setQuillLoading] = useState(true);
	const [detailLoading, setDetailLoading] = useState(true);
	const listCategories = [
		{ label: "Article", value: "articles" },
		{ label: "News", value: "news" },
	];

	const listTags = [
		{ label: "Football", value: "football" },
		{ label: "Social", value: "social" },
		{ label: "Politics", value: "politics" },
		{ label: "Technology", value: "technology" },
		{ label: "Business", value: "business" },
		{ label: "Entertainment", value: "entertainment" },
		{ label: "Sports", value: "sports" },
		{ label: "Health", value: "health" },
		{ label: "Science", value: "science" },
		{ label: "Environment", value: "environment" },
		{ label: "Education", value: "education" },
		{ label: "Economy", value: "economy" },
		{ label: "Lifestyle", value: "lifestyle" },
		{ label: "Culture", value: "culture" },
		{ label: "Travel", value: "travel" },
		{ label: "Crime", value: "crime" },
		{ label: "Weather", value: "weather" },
		{ label: "Opinion", value: "opinion" },
		{ label: "Fashion", value: "fashion" },
		{ label: "Gaming", value: "gaming" },
		{ label: "Music", value: "music" },
		{ label: "Movies", value: "movies" },
	];

	const getDetail = async () => {
		try {
			setQuillLoading(true);
			setDetailLoading(true);
			const req = await fetchApi.get(`/collection/${uuid}`);
			if (req.status === 200) {
				setCollection(req.data);
			}
		} catch (error) {
			console.error("Failed to fetch collection:", error);
		} finally {
			setQuillLoading(false);
			setDetailLoading(false);
		}
	};

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

	const uploadThumbnail = async (file) => {
		setLoading(true);
		const formData = new FormData();
		formData.append("thumbnail", file);

		try {
			const req = await fetchApi.patch(
				`/collection/upload/thumbnail/${uuid}`,
				formData
			);
			if (req.status === 200) {
				const res = req.data.thumbnail;
				setCollection((prev) => ({ ...prev, thumbnail: res }));
			} else {
				console.error("Upload failed with status:", req.status);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setLoading(false);
		}
	};

	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		input.onchange = () => {
			const file = input.files?.[0];
			if (file) uploadThumbnail(file);
		};

		input.click();
	};

	useEffect(() => {
		if (uuid) {
			getDetail();
		}
	}, [uuid]);
	return (
		<div className="p-6" style={{ height: "calc(100vh - 92px)" }}>
			<div className="flex w-full justify-center gap-6">
				<div className="bg-white rounded-lg w-full max-w-4xl">
					{quillLoading ? (
						<div className="text-center text-gray-500 py-8">
							Loading content...
						</div>
					) : (
						<ReactQuill
							value={collection?.content || ""}
							uuid={uuid}
							onChange={(newValue) =>
								setCollection((prev) => ({ ...prev, content: newValue }))
							}
						/>
					)}
				</div>
				<div className="w-full max-w-[420px]">
					<div className="flex flex-col gap-4 border p-4 ">
						{detailLoading ? (
							<div className="text-center text-gray-500 py-8">
								Loading details...
							</div>
						) : (
							<>
								<div className="text-2xl">Detail Collection:</div>
								<div>
									<div>Thumbnail:</div>
									<div className="relative">
										<img
											src={collection?.thumbnail || "/placeholder.jpeg"}
											alt="thumbnail"
											className="rounded-md"
										/>
										<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100 pointer-events-none">
											<div
												className="bg-black/60 w-full h-full flex cursor-pointer items-center justify-center rounded-md p-2 pointer-events-auto"
												onClick={selectLocalImage}
											>
												{iconSvg.edit}
											</div>
										</div>
									</div>
								</div>
								<div>
									<div>Title:</div>
									<TextInput
										value={collection.title}
										onChange={(e) => {
											setCollection((prev) => ({
												...prev,
												title: e.target.value,
											}));
										}}
									/>
								</div>
								<div>
									<div>Category:</div>
									<Dropdown
										items={listCategories}
										defaultValue={collection.category || "User"}
										onStateChange={(e) =>
											setCollection((prev) => ({ ...prev, category: e }))
										}
									/>
								</div>
								<div>
									<div>Tags:</div>
									<Dropdown
										items={listTags}
										type="multi"
										defaultValue={collection.tag}
										onStateChange={(e) =>
											setCollection((prev) => ({ ...prev, tag: e }))
										}
									/>
								</div>
								<div>
									<div>Anonymous:</div>
									<ToggleButton
										isActive={collection.isAnonim}
										onChange={(newValue) => {
											setCollection((prev) => ({
												...prev,
												isAnonim: newValue,
											}));
										}}
									/>
								</div>
								<Button
									onClick={handleSave}
									className=" px-4 py-2 rounded-md"
									disabled={loading}
									isLoading={loading}
								>
									Save
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CollectionDetail;
