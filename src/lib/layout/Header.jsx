import { useState } from "react";
import Button from "../components/Button";
import { usePathname, useRouter } from "next/navigation";

const Header = ({ sidebarWidth, pageTitle }) => {
	const router = useRouter();

	const createCollection = async () => {
		const req = await fetchApi.post("/collection", {
			title: "New Project",
			content: "",
		});

		if (req.status === 201) {
			router.push(`/dashboard/collection/${req.data.collection_uuid}`);
		}
	};
	return (
		<div
			className={`fixed top-0 z-[1] ${sidebarWidth} right-0 flex flex-col justify-between border-b p-6 transition-all duration-300`}
		>
			<div className="flex h-11 items-center justify-between gap-4">
				<div className="text-2xl font-bold">{pageTitle}</div>
				<Button className="p-3 h-full rounded-md" onClick={createCollection}>
					Create Collection
				</Button>
			</div>
		</div>
	);
};

export default Header;
