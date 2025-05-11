"use client";
import { useState } from "react";
import fetchApi from "@/lib/api/fetchApi";
import TextInput from "@/lib/components/TextInput";
import ToggleButton from "@/lib/components/Toogle";
import Dropdown from "@/lib/components/Dropdown";
import Button from "@/lib/components/Button";
import { iconSvg } from "@/lib/Icons/icon";

const DetailsForm = ({
	collection,
	setCollection,
	loading,
	setLoading,
	uuid,
}) => {
	const listCategories = [
		{ label: "Article", value: "articles" },
		{ label: "News", value: "news" },
	];

	const listTags = [
		{ label: "Business", value: "business" },
		{ label: "Crime", value: "crime" },
		{ label: "Culture", value: "culture" },
		{ label: "Economy", value: "economy" },
		{ label: "Education", value: "education" },
		{ label: "Entertainment", value: "entertainment" },
		{ label: "Environment", value: "environment" },
		{ label: "Fashion", value: "fashion" },
		{ label: "Food", value: "food" },
		{ label: "Football", value: "football" },
		{ label: "Gaming", value: "gaming" },
		{ label: "Health", value: "health" },
		{ label: "Lifestyle", value: "lifestyle" },
		{ label: "Movies", value: "movies" },
		{ label: "Music", value: "music" },
		{ label: "Opinion", value: "opinion" },
		{ label: "Politics", value: "politics" },
		{ label: "Science", value: "science" },
		{ label: "Social", value: "social" },
		{ label: "Sports", value: "sports" },
		{ label: "Technology", value: "technology" },
		{ label: "Travel", value: "travel" },
		{ label: "Weather", value: "weather" },
	];

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

	return (
		<div className="w-full max-w-[420px]">
			<div className="flex flex-col gap-4 border border-[#cccccc] p-4">
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
					className="px-4 py-2 rounded-md"
					disabled={loading}
					isLoading={loading}
				>
					Save
				</Button>
			</div>
		</div>
	);
};

export default DetailsForm;
