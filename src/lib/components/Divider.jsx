// components/Divider.tsx
import React from "react";
import clsx from "clsx";

const Divider = ({
	orientation = "horizontal",
	className = "",
	color = "#E0E1E4",
}) => {
	const isHorizontal = orientation === "horizontal";

	return (
		<div
			className={clsx(
				"flex items-center gap-6",
				isHorizontal ? "w-full flex-row" : "h-full flex-col",
				className
			)}
		>
			<div
				className={clsx(isHorizontal ? "w-full border-t" : "h-full border-l")}
				style={{ borderColor: color }}
			></div>
			<div
				className={clsx(
					"min-h-2 min-w-2 rotate-45 border",
					isHorizontal ? "" : "rotate-[135deg]"
				)}
				style={{ backgroundColor: color, borderColor: color }}
			></div>
			<div
				className={clsx(isHorizontal ? "w-full border-t" : "h-full border-l")}
				style={{ borderColor: color }}
			></div>
		</div>
	);
};

export default Divider;
