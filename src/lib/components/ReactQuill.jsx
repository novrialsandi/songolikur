"use client";

import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import fetchApi from "../api/fetchApi";
import { toast } from "react-toastify";
import { compressImage } from "@/lib/utils/imageCompression";
import { replaceImageURLsInContent } from "../utils/transformURL";

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
				[{ color: [] }, { background: [] }],
				[{ size: ["small", false, "large", "huge"] }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				[{ font: [] }],
				[{ align: [] }],
				["link", "image", "video"],
				[{ direction: "rtl" }],
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
		const index = range ? range.index : quill.getLength(); // insert at cursor or end
		quill.insertEmbed(index, "image", url);
		quill.setSelection(index + 1); // move cursor after image
	};

	const saveToServer = async (files) => {
		const formData = new FormData();
		for (const file of files) {
			const compressedFile = await compressImage(file, {
				maxWidthOrHeight: 1080,
				maxSizeMB: 0.5,
				initialQuality: 1,
			});

			formData.append("content", compressedFile);
		}

		try {
			const res = await fetchApi.post(
				`/collection/upload/content/${uuid}`,
				formData
			);

			if (res.status === 201) {
				for (const imageUrl of res.data.contents) {
					insertToEditor(imageUrl);
				}
			} else {
				console.error("Upload failed with status:", res.status);
				toast.error("Failed to upload content image. Please try again.");
			}
		} catch (error) {
			console.error("Upload failed:", error);
			toast.error("An error occurred while uploading the content.");
		}
	};

	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		// input.setAttribute("multiple", "true");
		input.click();

		input.onchange = () => {
			const files = Array.from(input.files);
			if (files.length > 0) {
				saveToServer(files);
			}
		};
	};

	useEffect(() => {
		if (!quill) return;

		const toolbar = quill.getModule("toolbar");
		if (toolbar) {
			toolbar.addHandler("image", selectLocalImage);
		}

		const handlePaste = (e) => {
			if (e.clipboardData?.types.includes("Files")) {
				e.preventDefault();
				toast.warn(
					"Please use the image upload button to insert images. It helps keep our server not burning 🔥🔥🔥"
				);
			}
		};

		const handleDrop = (e) => {
			e.preventDefault();
			toast.warn(
				"Please use the image upload button to insert images. It helps keep our server not burning 🔥🔥🔥"
			);
		};

		quill.root.addEventListener("paste", handlePaste);
		quill.root.addEventListener("drop", handleDrop);

		const handleTextChange = () => {
			let html = quill.root.innerHTML;

			// Replace URLs inside the content
			html = replaceImageURLsInContent(html);

			// Remove base64 images
			const cleanedHtml = removeBase64Images(html);

			if (onChange) onChange(cleanedHtml);
		};

		quill.on("text-change", handleTextChange);

		return () => {
			quill.root.removeEventListener("paste", handlePaste);
			quill.root.removeEventListener("drop", handleDrop);
			quill.off("text-change", handleTextChange);
		};
	}, [quill, onChange]);

	useEffect(() => {
		if (!quill) return;

		// Clean base64 images and replace URLs before pasting content
		let cleanedValue = removeBase64Images(value);
		cleanedValue = replaceImageURLsInContent(cleanedValue);

		if (initialLoad.current) {
			quill.clipboard.dangerouslyPasteHTML(cleanedValue);
			initialLoad.current = false;
		} else if (cleanedValue !== quill.root.innerHTML) {
			quill.clipboard.dangerouslyPasteHTML(cleanedValue);
		}
	}, [quill, value]);

	return (
		<div className="editor-container h-[calc(100vh-208px)] w-full max-w-[740px]">
			<div ref={quillRef} />
		</div>
	);
};

export default ReactQuill;
