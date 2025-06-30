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
			className="prose prose-sm max-w-none prose-p:my-0 prose-h2:mt-0 prose-h2:mb-0"
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
}
