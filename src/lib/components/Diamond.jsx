import React from "react";
import clsx from "clsx";

const Diamond = ({ orientation = "horizontal", color = "#E0E1E4" }) => {
	const isHorizontal = orientation === "horizontal";

	return (
		<div
			className={clsx(
				"h-2 w-2 rotate-45 border",
				isHorizontal ? "" : "rotate-[135deg]"
			)}
			style={{ backgroundColor: color, borderColor: color }}
		></div>
	);
};

export default Diamond;
