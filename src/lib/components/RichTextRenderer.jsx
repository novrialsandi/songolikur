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
			className="prose prose-sm max-w-none [&_*]:my-0"
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
}
