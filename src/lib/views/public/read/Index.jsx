"use client";

import { Suspense } from "react";
import Collections from "./Collections";

const Read = () => {
	return (
		<div className="p-6 max-w-4xl w-full">
			<Suspense>
				<Collections />
			</Suspense>{" "}
		</div>
	);
};

export default Read;
