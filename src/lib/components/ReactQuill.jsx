"use client";

import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import fetchApi from "../api/fetchApi";

const ReactQuill = ({ value = "", uuid, onChange }) => {
	// Define toolbar options with all available formatting features
	const modules = {
		toolbar: {
			container: [
				["bold", "italic", "underline", "strike"],
				["blockquote", "code-block"],
				[{ header: 1 }, { header: 2 }],
				[{ list: "ordered" }, { list: "bullet" }],
				[{ script: "sub" }, { script: "super" }],
				[{ indent: "-1" }, { indent: "+1" }],
				[{ direction: "rtl" }],
				[{ size: ["small", false, "large", "huge"] }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				[{ color: [] }, { background: [] }],
				[{ font: [] }],
				[{ align: [] }],
				["link", "image", "video"],
				["clean"],
			],
			handlers: {},
		},
		clipboard: {
			matchVisual: false,
		},
	};

	const formats = [
		"header",
		"font",
		"size",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"indent",
		"link",
		"image",
		"video",
		"color",
		"background",
		"align",
		"code-block",
		"script",
		"direction",
	];

	const { quill, quillRef } = useQuill({
		modules,
		formats,
		placeholder: "Start typing...",
	});
	const initialLoad = useRef(true);

	// Function to remove base64 images from HTML content
	const removeBase64Images = (htmlContent) => {
		if (!htmlContent) return htmlContent;

		// Create a temporary DOM element to parse the HTML
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlContent;

		// Find all image elements
		const images = tempDiv.querySelectorAll("img");

		// Check each image for base64 data
		images.forEach((img) => {
			const src = img.getAttribute("src");
			if (src && src.startsWith("data:image/")) {
				// Remove the image element completely
				img.parentNode.removeChild(img);
			}
		});

		return tempDiv.innerHTML;
	};

	// Insert Image(selected by user) to quill
	const insertToEditor = (url) => {
		const range = quill.getSelection();
		quill.insertEmbed(range.index, "image", url);
	};

	const saveToServer = async (file) => {
		const formData = new FormData();
		formData.append("content", file);

		try {
			const res = await fetchApi.post(
				`/collection/upload/content/${uuid}`,
				formData
			);
			if (res.status === 201 && res.data?.content) {
				insertToEditor(res.data.content);
			} else {
				console.error("Upload failed with status:", res.status);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		}
	};

	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = () => {
			const file = input.files[0];
			saveToServer(file);
		};
	};

	useEffect(() => {
		if (quill) {
			// Set up toolbar handler once
			quill.getModule("toolbar").addHandler("image", selectLocalImage);

			// Prevent copy-paste and drop image
			quill.root.addEventListener("paste", (e) => {
				if (e.clipboardData.types.includes("Files")) {
					e.preventDefault();
					alert(
						"Please use the image upload button to insert images. It helps keep our server not burning 🔥🔥🔥"
					);
				}
			});

			quill.root.addEventListener("drop", (e) => {
				e.preventDefault();
				alert(
					"Please use the image upload button to insert images. It helps keep our server not burning 🔥🔥🔥"
				);
			});

			// Register text-change event once
			quill.on("text-change", () => {
				const html = quill.root.innerHTML;
				// Remove any base64 images before triggering onChange
				const cleanedHtml = removeBase64Images(html);
				if (onChange) onChange(cleanedHtml);
			});
		}
	}, [quill]);

	useEffect(() => {
		if (quill) {
			// Remove base64 images from the incoming value
			const cleanedValue = removeBase64Images(value);

			if (initialLoad.current) {
				quill.clipboard.dangerouslyPasteHTML(cleanedValue);
				initialLoad.current = false;
			} else if (cleanedValue !== quill.root.innerHTML) {
				quill.clipboard.dangerouslyPasteHTML(cleanedValue);
			}
		}
	}, [quill, value]);

	return (
		<div className="editor-container h-[calc(100vh-208px)] w-full max-w-3xl">
			<div ref={quillRef} />
		</div>
	);
};

export default ReactQuill;
