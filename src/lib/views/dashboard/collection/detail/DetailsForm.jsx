"use client";
import { useState, useEffect } from "react";
import fetchApi from "@/lib/api/fetchApi";
import TextInput from "@/lib/components/TextInput";
import TextArea from "@/lib/components/TextArea";
import ToggleButton from "@/lib/components/Toogle";
import Dropdown from "@/lib/components/Dropdown";
import Button from "@/lib/components/Button";
import { iconSvg } from "@/lib/Icons/icon";
import { useSessionStore } from "@/lib/stores";
import { listCategories, listTags } from "@/lib/constant";
import Modal from "@/lib/components/Modal";

const DetailsForm = ({
	collection,
	setCollection,
	loading,
	setLoading,
	uuid,
}) => {
	const { session } = useSessionStore();
	const [collabulator, setCollabulator] = useState([]);
	// const [isCollab, setIsCollab] = useState(false);

	const isAdmin = session.role === "admin";
	const isOwner = session.user_uuid === collection.user_uuid;
	const isCollabulator = session.user_uuid === collection.collaboration_uuid;
	const isEditor = session.user_uuid === collection.editor_uuid;

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

	const getCollaborator = async () => {
		try {
			const res = await fetchApi("/user/collaborator");

			if (res.status === 200) {
				setCollabulator(res.data.collaborator);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCollaborator();
	}, []);

	return (
		<div className="border border-[#cccccc] p-4 space-y-2 max-h-[calc(100vh-140px)]">
			<div className="text-2xl">Detail Collection:</div>
			<div>
				<div className="relative">
					<img
						src={collection?.thumbnail || "/placeholder.webp"}
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
			<div className="flex flex-col gap-4 max-h-[calc(100vh-208px)] overflow-y-auto no-scrollbar">
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
					<div>SEO:</div>
					<TextArea
						value={collection.seo || ""}
						onChange={(e) => {
							setCollection((prev) => ({
								...prev,
								seo: e.target.value,
							}));
						}}
					/>
				</div>
				{/* <div>
					<div>Collaboration:</div>
					<div className="flex flex-col gap-2">
						{isCollab && (
							<>
								<Dropdown items={collection} />
							</>
						)}
						<ToggleButton
							isActive={isCollab}
							onChange={(newValue) => setIsCollab(newValue)}
						/>
					</div>
				</div> */}
				{/* <div>
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
				</div> */}
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
