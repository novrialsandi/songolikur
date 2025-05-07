import { useState } from "react";
import Button from "../components/Button";
import { useRouter, useParams } from "next/navigation";
import fetchApi from "../api/fetchApi";

const Header = ({ sidebarWidth, pageTitle }) => {
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = useState(false);

	const createCollection = async () => {
		try {
			setLoading(true);
			const req = await fetchApi.post("/collection", {
				title: "New Project",
				content: "",
			});

			if (req.status === 201) {
				router.push(`/dashboard/collection/${req.data.collection_uuid}`);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div
			className={`fixed top-0 z-[1] ${sidebarWidth} right-0 flex flex-col justify-between border-b p-6 transition-all duration-300`}
		>
			<div className="flex h-11 items-center justify-between gap-4">
				<div className="text-2xl font-bold">{pageTitle}</div>
				{!params.uuid && (
					<Button
						className="p-3 h-full rounded-md w-40"
						onClick={createCollection}
						disabled={loading}
						isLoading={loading}
					>
						Create Collection
					</Button>
				)}
			</div>
		</div>
	);
};

export default Header;
