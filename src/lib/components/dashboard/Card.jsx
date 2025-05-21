import React, { useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";
import Modal from "../Modal";
import fetchApi from "@/lib/api/fetchApi";
import Button from "../Button";
import Link from "next/link";
import { toast } from "react-toastify";

const Card = ({ collection, onCollectionDelete }) => {
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const deleteCollection = async () => {
		try {
			setLoadingDelete(true);
			const res = await fetchApi.delete(
				`/collection/${collection.collection_uuid}`
			);
			if (res.status === 200) {
				onCollectionDelete(collection.collection_uuid);
				toast.success("Collection deleted successfully");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete collection. Please try again.");
		} finally {
			setDeleteModal(false);
			setLoadingDelete(false);
		}
	};

	return (
		<>
			<Modal
				preventClose
				visible={deleteModal}
				onClose={() => setDeleteModal(false)}
				className="p-6 max-w-sm "
			>
				<div className="space-y-4">
					<div className="text-lg font-semibold">Delete Collection</div>
					<p className="text-sm text-gray-600">
						Are you sure you want to delete the collection{" "}
						<strong>{collection.title}</strong>?
					</p>
					<div className="flex gap-4">
						<Button
							onClick={deleteCollection}
							isLoading={loadingDelete}
							disabled={loadingDelete}
							className="flex-1 bg-red-500 text-secondary rounded-md"
						>
							Delete
						</Button>
						<Button
							onClick={() => setDeleteModal(false)}
							className="flex-1 bg-gray-300 text-gray-700 rounded-md"
						>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>

			<Link
				href={`/dashboard/collection/${collection.collection_uuid}`}
				className="bg-white relative border border-[#cccccc] rounded-md overflow-hidden cursor-pointer duration-150 hover:-translate-y-1.5"
			>
				<span
					className={`text-xs absolute left-0 top-0 font-semibold py-1 px-2 rounded-br-md ${
						collection.status === "published"
							? "bg-green-100 text-green-800"
							: collection.status === "review"
							? "bg-yellow-100 text-yellow-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{collection.status || "Draft"}
				</span>

				{/* Delete Button */}
				<button
					onClick={(e) => {
						e.stopPropagation(); // Prevents the Link from being triggered
						e.preventDefault(); // Ensures no default link action occurs
						setDeleteModal(true);
					}}
					className="bg-white absolute right-0 top-0 font-semibold py-1 px-2 rounded-bl-md hover:scale-110 duration-200 cursor-pointer"
				>
					{iconSvg.delete}
				</button>

				<img
					src={collection.thumbnail || "/placeholder.webp"}
					alt={collection.title}
					className="w-full h-48 object-cover"
				/>
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-2 truncate">
						{collection.title}
					</h2>

					<div className="flex items-center gap-2 mb-2">
						<img
							src={collection.user?.avatar || "/avatar.png"}
							alt="User Avatar"
							className="w-8 h-8 object-cover rounded-full"
						/>

						<p className="text-sm text-gray-600 ">
							{collection.user?.name || "Unknown Author"}
						</p>
					</div>
					<span className="text-xs text-gray-500">
						{new Date(collection.publishedAt).toLocaleDateString() || "Draft"}
					</span>
				</div>
			</Link>
		</>
	);
};

export default Card;
