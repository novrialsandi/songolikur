import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Card = ({ collection }) => {
	const router = useRouter();

	return (
		<div
			onClick={() =>
				router.push(`/dashboard/collection/${collection.collection_uuid}`)
			}
			className="bg-white border rounded-xl  overflow-hidden"
		>
			<Image
				src={collection.thumbnail || "/placeholder.png"}
				alt={collection.title}
				width={400}
				height={200}
				className="w-full h-48 object-cover"
			/>
			<div className="p-4">
				<h2 className="text-lg font-semibold mb-2 truncate">
					{collection.title}
				</h2>
				<p className="text-sm text-gray-600 mb-2">
					{collection.user?.name || "Unknown Author"}
				</p>
				<div className="flex items-center gap-2">
					<Image
						src={collection.user?.avatar || "/avatar-placeholder.png"}
						alt="User Avatar"
						width={32}
						height={32}
						className="w-8 h-8 rounded-full"
					/>
					<span className="text-xs text-gray-500">
						{new Date(collection.publishedAt).toLocaleDateString() || "Draft"}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Card;
