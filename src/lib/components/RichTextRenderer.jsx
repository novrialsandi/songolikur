"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function RichTextRenderer({ html }) {
	const [cleanHTML, setCleanHTML] = useState("");

	useEffect(() => {
		setCleanHTML(DOMPurify.sanitize(html));
	}, [html]);

	return (
		<div
			className="prose max-w-none"
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
}
