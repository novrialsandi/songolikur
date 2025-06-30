"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import fetchApi from "@/lib/api/fetchApi";
import ReactQuill from "@/lib/components/ReactQuill";
import DetailsForm from "./DetailsForm";
import { useSessionStore, useCollectionSelectedStore } from "@/lib/stores";
import DOMPurify from "dompurify";
import Button from "@/lib/components/Button";
import { toast } from "react-toastify";
import RichTextRenderer from "@/lib/components/RichTextRenderer";

const CollectionDetail = () => {
	const router = useRouter();
	const { uuid } = useParams();
	const { session } = useSessionStore();
	const { setCollectionSelected } = useCollectionSelectedStore();

	const [collection, setCollection] = useState({});
	const [loading, setLoading] = useState(false);
	const [detailLoading, setDetailLoading] = useState(true);

	const getDetail = async () => {
		try {
			setDetailLoading(true);
			const req = await fetchApi.get(`/collection/${uuid}`);
			if (req.status === 200) {
				setCollection(req.data);

				setCollectionSelected(req.data.title);
			}
		} catch (error) {
			console.error("Failed to fetch collection:", error);
		} finally {
			setDetailLoading(false);
		}
	};

	const handleStatus = async (status) => {
		try {
			setLoading(true);

			const res = await fetchApi.patch(`/collection/status/${uuid}`, {
				status: status,
				editor_uuid: "",
				review_note: status,
				scheduleAt: null,
			});
			if (res.status === 200) {
				toast.success(`Collection status updated to "${status}" successfully`);
				router.push(`/dashboard/collection/${status}`);
			} else {
				console.error("Status update failed with status:", res.status);
				toast.error("Failed to update collection status. Please try again.");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while updating the status.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (uuid) {
			getDetail();
		}

		return () => {
			setCollectionSelected("");
		};
	}, [uuid]);

	if (detailLoading) {
		return (
			<div className="text-center text-gray-500 py-8">Loading content...</div>
		);
	}

	if (
		collection.status === "published" ||
		(session.role !== "admin" &&
			collection.status === "review" &&
			collection.editor_uuid !== session.user_uuid)
	) {
		const sanitizedContent = DOMPurify.sanitize(collection.content);

		return (
			<>
				<div className="p-6 w-full flex justify-center">
					<div className="max-w-[740px]">
						<img src={collection.thumbnail} alt="" />
						<RichTextRenderer html={sanitizedContent} />
					</div>
				</div>
				<div className="w-full flex justify-center mb-4">
					<Button
						onClick={() => {
							handleStatus("draft");
						}}
						disabled={loading}
						isLoading={loading}
						className="px-4 py-2 rounded-md "
					>
						Send to Draft
					</Button>
				</div>
			</>
		);
	}

	return (
		<div className="p-6">
			<div className="flex relative w-full justify-center gap-6 h-[calc(100vh-140px)]">
				<ReactQuill
					value={collection?.content || ""}
					uuid={uuid}
					onChange={(newValue) =>
						setCollection((prev) => ({ ...prev, content: newValue }))
					}
				/>

				<div className="relative w-full max-w-[420px]">
					<div className=" bg-white w-full max-w-[420px]">
						<DetailsForm
							collection={collection}
							setCollection={setCollection}
							loading={loading}
							setLoading={setLoading}
							uuid={uuid}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CollectionDetail;
