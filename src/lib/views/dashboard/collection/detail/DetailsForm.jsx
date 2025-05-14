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
import { useRouter } from "next/navigation";

const DetailsForm = ({
	collection,
	setCollection,
	loading,
	setLoading,
	uuid,
}) => {
	const router = useRouter();

	const { session } = useSessionStore();
	const [collabulator, setCollabulator] = useState([]);
	const [editor, setEditor] = useState([]);
	const [isCollab, setIsCollab] = useState(false);
	const [modalStatus, setModalStatus] = useState(false);
	const [updateStatus, setUpdateStatus] = useState({
		status: "",
		editor_uuid: "",
		review_note: "",
		scheduleAt: null,
	});

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
				const formattedData = res.data.collaborator.map((item) => ({
					value: item.user_uuid,
					label: item.name,
				}));

				setCollabulator(formattedData);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const getEditor = async () => {
		try {
			const res = await fetchApi("/user/editor");

			if (res.status === 200) {
				const formattedData = res.data.editors.map((item) => ({
					value: item.user_uuid,
					label: item.name,
				}));

				setEditor(formattedData);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleStatus = async (status) => {
		try {
			setLoading(true);

			const res = await fetchApi.patch(`/collection/status/${uuid}`, {
				...updateStatus,
				status: status,
				review_note: status,
			});
			if (res.status === 200) {
				router.push(`/dashboard/collection/${status}`);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCollaborator();
		getEditor();

		if (collection.collaboration_uuid) {
			setIsCollab(true);
		}
	}, []);

	return (
		<>
			<Modal
				preventClose
				visible={modalStatus}
				onClose={() => {
					setModalStatus(false);
				}}
				className={"p-6 max-w-lg"}
			>
				<div className="space-y-4">
					<div className="text-2xl font-semibold">Review Request</div>
					<div className="flex flex-col items-center gap-4">
						<Dropdown
							items={editor}
							defaultValue={collection.editor_uuid}
							onStateChange={(e) =>
								setUpdateStatus((prev) => ({
									...prev,
									editor_uuid: e,
								}))
							}
						/>
						<div>
							You cannot update your collection after selecting an editor.
							Please pull your review request if you want to edit again or wait
							for the editor to send it back to draft.
						</div>

						<Button
							onClick={() => handleStatus("review")}
							className="w-full rounded-md"
							disabled={loading}
							isLoading={loading}
						>
							Register
						</Button>
					</div>
				</div>
			</Modal>

			<div className="border border-[#cccccc] p-4 space-y-2 max-h-[calc(100vh-193px)] overflow-y-auto no-scrollbar">
				<div className="flex flex-col gap-4 h-full ">
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
					<div>
						<div>Collaboration:</div>
						<div className="flex flex-col gap-2">
							{isOwner ? (
								<>
									{(isCollab || collection.collaboration_uuid) && (
										<>
											<Dropdown
												items={collabulator}
												defaultValue={collection.collaboration_uuid}
												onStateChange={(e) =>
													setCollection((prev) => ({
														...prev,
														collaboration_uuid: e,
													}))
												}
											/>
										</>
									)}
									<ToggleButton
										isActive={isCollab}
										onChange={(newValue) => {
											setIsCollab(newValue);

											setCollection((prev) => ({
												...prev,
												collaboration_uuid: newValue
													? prev.collaboration_uuid
													: null,
											}));
										}}
									/>
								</>
							) : (
								<div className="font-bold">
									{collection.user.name} ft. {collection.collaboration.name}
								</div>
							)}
						</div>
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
			<div className="mt-4 flex gap-2">
				{collection.status === "draft" && (isOwner || isCollabulator) ? (
					<Button
						onClick={() => setModalStatus(true)}
						className="px-4 py-2 rounded-md w-full"
					>
						Request Review
					</Button>
				) : collection.status === "review" && isEditor ? (
					<>
						<Button
							onClick={() => {
								handleStatus("draft");
							}}
							disabled={loading}
							isLoading={loading}
							className="px-4 py-2 bg-red-500 rounded-md w-full"
						>
							Reject
						</Button>
						<Button
							onClick={() => {
								handleStatus("published");
							}}
							disabled={loading}
							isLoading={loading}
							className="px-4 py-2 rounded-md w-full"
						>
							Approve
						</Button>
					</>
				) : (
					<Button
						onClick={() => {
							handleStatus("draft");
						}}
						disabled={loading}
						isLoading={loading}
						className="px-4 py-2 rounded-md w-full"
					>
						Send to Draft
					</Button>
				)}
			</div>
		</>
	);
};

export default DetailsForm;
