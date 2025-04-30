"use client";

import { useState, useEffect, useRef } from "react";
import fetchApi from "../api/fetchApi";

const QuillEditor = ({ onChange, uuid }) => {
	const [quill, setQuill] = useState(null);
	const editorRef = useRef(null);
	const [pendingImages, setPendingImages] = useState([]);
	const quillInitializedRef = useRef(false);

	const loadQuillLibrary = () => {
		if (window.Quill) return Promise.resolve(window.Quill);

		const script = document.createElement("script");
		script.id = "quill-js";
		script.src =
			"https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
		script.async = true;

		return new Promise((resolve, reject) => {
			script.onload = () => resolve(window.Quill);
			script.onerror = reject;
			document.body.appendChild(script);
		});
	};

	// Helper to load Quill CSS if not already loaded
	const loadQuillCSS = () => {
		if (document.getElementById("quill-css")) return;

		const link = document.createElement("link");
		link.id = "quill-css";
		link.rel = "stylesheet";
		link.href =
			"https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
		document.head.appendChild(link);
	};

	// Helper to load Image Resize Module
	const loadImageResizeModule = () => {
		if (window.ImageResize) return Promise.resolve(window.ImageResize);

		// Load the image resize module script
		const script = document.createElement("script");
		script.id = "quill-image-resize";
		script.src =
			"https://unpkg.com/quill-image-resize-module@3.0.0/image-resize.min.js";
		script.async = true;

		return new Promise((resolve, reject) => {
			script.onload = () => resolve(window.ImageResize);
			script.onerror = reject;
			document.body.appendChild(script);
		});
	};

	// Add custom CSS for image resize handles
	const addResizeStyles = () => {
		if (document.getElementById("quill-image-resize-css")) return;

		const style = document.createElement("style");
		style.id = "quill-image-resize-css";
		style.textContent = `
			.ql-editor .image-resizer {
				position: absolute;
				border: 1px dashed #777;
				background-color: transparent;
				pointer-events: none;
				z-index: 1;
			}
			.ql-editor .image-resizer .handle {
				position: absolute;
				height: 12px;
				width: 12px;
				background-color: #6366f1;
				border: 1px solid white;
				border-radius: 50%;
				pointer-events: all;
			}
			.ql-editor .image-resizer .handle-nw {
				top: -6px;
				left: -6px;
				cursor: nwse-resize;
			}
			.ql-editor .image-resizer .handle-ne {
				top: -6px;
				right: -6px;
				cursor: nesw-resize;
			}
			.ql-editor .image-resizer .handle-sw {
				bottom: -6px;
				left: -6px;
				cursor: nesw-resize;
			}
			.ql-editor .image-resizer .handle-se {
				bottom: -6px;
				right: -6px;
				cursor: nwse-resize;
			}
			.ql-editor img {
				max-width: 100%;
			}
		`;
		document.head.appendChild(style);
	};

	// Initialize Quill editor instance
	const initializeQuill = async (Quill) => {
		if (!editorRef.current || quillInitializedRef.current) return;

		// Load image resize module
		try {
			await loadImageResizeModule();
			addResizeStyles();
		} catch (error) {
			console.error("Failed to load image resize module:", error);
		}

		// Register the image resize module if available
		if (window.ImageResize) {
			Quill.register("modules/imageResize", window.ImageResize.default);
		}

		editorRef.current.innerHTML = ""; // Clear editor container
		const quillInstance = new Quill(editorRef.current, {
			theme: "snow",
			placeholder: "Write your story...",
			modules: {
				toolbar: {
					container: [
						[{ font: [] }, { size: [] }],
						["bold", "italic", "underline", "strike"],
						[{ color: [] }, { background: [] }],
						[{ script: "sub" }, { script: "super" }],
						[{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
						[{ list: "ordered" }, { list: "bullet" }],
						[{ indent: "-1" }, { indent: "+1" }],
						[{ direction: "rtl" }],
						[{ align: [] }],
						["link", "image"],
						["clean"],
					],
					handlers: {
						image: selectLocalImage,
					},
				},
				imageResize: {
					modules: ["Resize", "DisplaySize"],
					displayStyles: {
						backgroundColor: "transparent",
						border: "1px dashed #777",
						color: "black",
					},
					handleStyles: {
						backgroundColor: "#6366f1",
						border: "1px solid white",
						borderRadius: "50%",
					},
				},
			},
		});

		quillInstance.on("text-change", () => {
			onChange(quillInstance.root.innerHTML);
		});

		quillInitializedRef.current = true;
		return quillInstance;
	};

	// Load Quill, initialize it, and handle pending images
	useEffect(() => {
		const setupQuillEditor = async () => {
			if (typeof window === "undefined") return;

			loadQuillCSS();

			try {
				const Quill = await loadQuillLibrary();
				const quillInstance = await initializeQuill(Quill);
				setQuill(quillInstance);

				// Insert any pending images if Quill is initialized
				if (quillInstance && pendingImages.length > 0) {
					pendingImages.forEach((url) => insertToEditor(url, quillInstance));
					setPendingImages([]);
				}
			} catch (error) {
				console.error("Failed to load Quill:", error);
			}
		};

		setupQuillEditor();

		// Cleanup Quill editor on unmount
		return () => {
			if (quill && typeof quill.destroy === "function") {
				quill.destroy();
				quillInitializedRef.current = false;
			}
		};
	}, []);

	// Process pending images when quill becomes available
	useEffect(() => {
		if (quill && pendingImages.length > 0) {
			pendingImages.forEach((url) => insertToEditor(url, quill));
			setPendingImages([]);
		}
	}, [quill, pendingImages]);

	// Handle image selection and upload
	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		input.onchange = () => {
			const file = input.files?.[0];
			if (file) uploadImage(file);
		};

		input.click();
	};

	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("content", file);

		try {
			const req = await fetchApi.post(
				`/collection/upload/content/${uuid}`,
				formData
			);
			if (req.status === 201 && req.data?.content) {
				if (quill) {
					insertToEditor(req.data.content, quill);
				} else {
					setPendingImages((prev) => [...prev, req.data.content]);
				}
			} else {
				console.error("Upload failed with status:", req.status);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		}
	};

	// Insert image into the editor
	const insertToEditor = (url, editorInstance = quill) => {
		if (!editorInstance) {
			console.error("Cannot insert image: Quill editor is not initialized");
			return;
		}

		try {
			const range = editorInstance.getSelection();
			const index = range ? range.index : editorInstance.getLength();

			editorInstance.insertEmbed(index, "image", url);
			editorInstance.setSelection(index + 1, 0);

			onChange(editorInstance.root.innerHTML);
		} catch (error) {
			console.error("Error inserting image:", error);
		}
	};

	return (
		<div className="relative">
			<div ref={editorRef} className="min-h-64" />
		</div>
	);
};

export default QuillEditor;
