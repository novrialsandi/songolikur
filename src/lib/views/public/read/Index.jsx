"use client";

import { Suspense } from "react";
import Collections from "./Collections";

const Read = () => {
	return (
		<div className="w-full">
			<Suspense>
				<Collections />
			</Suspense>{" "}
		</div>
	);
};

export default Read;
