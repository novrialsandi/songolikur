import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import fetchApi from "../api/fetchApi";
import React, { useEffect, useState } from "react";

const ReactQuill = ({ value, uuid, onChange }) => {
	const [pendingImages, setPendingImages] = useState([]);

	// Helper function to insert an image into the editor
	const insertToEditor = (url, quillInstance) => {
		// Get the current selection position
		const range = quillInstance.getSelection();
		// Insert the image at cursor position
		if (range) {
			// Add a newline if we're not at the start of the document
			if (range.index > 0) {
				quillInstance.insertText(range.index, "\n");
				quillInstance.insertEmbed(range.index + 1, "image", url);
				quillInstance.setSelection(range.index + 2, 0); // Move cursor after image
			} else {
				quillInstance.insertEmbed(range.index, "image", url);
				quillInstance.setSelection(range.index + 1, 0); // Move cursor after image
			}
		} else {
			// If no selection, insert at the end
			const length = quillInstance.getLength();
			quillInstance.insertEmbed(length - 1, "image", url);
			quillInstance.setSelection(length, 0);
		}
	};

	// Function to upload an image and return its URL
	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("content", file);

		try {
			const req = await fetchApi.post(
				`/collection/upload/content/${uuid}`,
				formData
			);
			if (req.status === 201 && req.data?.content) {
				return req.data.content; // Return the URL/path
			} else {
				console.error("Upload failed with status:", req.status);
				return null;
			}
		} catch (error) {
			console.error("Upload failed:", error);
			return null;
		}
	};

	// Define toolbar options with all available formatting features
	const modules = {
		toolbar: {
			container: [
				["bold", "italic", "underline", "strike"], // toggled buttons
				["blockquote", "code-block"],

				[{ header: 1 }, { header: 2 }], // custom button values
				[{ list: "ordered" }, { list: "bullet" }],
				[{ script: "sub" }, { script: "super" }], // superscript/subscript
				[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
				[{ direction: "rtl" }], // text direction

				[{ size: ["small", false, "large", "huge"] }], // custom dropdown
				[{ header: [1, 2, 3, 4, 5, 6, false] }],

				[{ color: [] }, { background: [] }], // dropdown with defaults
				[{ font: [] }],
				[{ align: [] }],

				["clean"], // remove formatting button

				["link", "image", "video"], // link and media
			],
			handlers: {
				// Custom image handler will be set after quill is created
			},
		},
		clipboard: {
			// Handle pasted images
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

	// Set up image handler once quill is ready
	useEffect(() => {
		if (quill) {
			// Override the default image handler
			quill.getModule("toolbar").addHandler("image", () => {
				const input = document.createElement("input");
				input.setAttribute("type", "file");
				input.setAttribute("accept", "image/*");
				input.click();

				input.onchange = async () => {
					const file = input.files[0];
					if (file) {
						// Upload the image and get URL
						const imageUrl = await uploadImage(file);
						if (imageUrl) {
							insertToEditor(imageUrl, quill);
						}
					}
				};
			});

			// Insert any pending images
			if (pendingImages.length > 0) {
				pendingImages.forEach((url) => {
					insertToEditor(url, quill);
				});
				setPendingImages([]);
			}

			// Handle pasted images
			quill.root.addEventListener("paste", async (event) => {
				const clipboardData = event.clipboardData || window.clipboardData;
				if (!clipboardData || !clipboardData.items) return;

				const items = clipboardData.items;
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						event.preventDefault();
						const file = items[i].getAsFile();
						const imageUrl = await uploadImage(file);
						if (imageUrl) {
							setTimeout(() => insertToEditor(imageUrl, quill), 0);
						}
						break;
					}
				}
			});

			// Replace base64 images with uploaded URLs
			const replaceBase64Images = async () => {
				const delta = quill.getContents();
				let hasChanges = false;

				// Function to check if string is base64
				const isBase64Image = (src) => {
					return src && src.startsWith("data:image");
				};

				// Iterate over all ops
				for (let i = 0; i < delta.ops.length; i++) {
					const op = delta.ops[i];

					// Check for base64 image
					if (op.insert && op.insert.image && isBase64Image(op.insert.image)) {
						const base64String = op.insert.image;

						// Convert base64 to File
						const arr = base64String.split(",");
						const mime = arr[0].match(/:(.*?);/)[1];
						const bstr = atob(arr[1]);
						let n = bstr.length;
						const u8arr = new Uint8Array(n);
						while (n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						const file = new File([u8arr], "image.png", { type: mime });

						// Upload the file
						const imageUrl = await uploadImage(file);
						if (imageUrl) {
							// Replace the image with a <p><img/></p> wrapper
							const range = { index: i, length: 1 };
							quill.deleteText(range.index, range.length);
							quill.insertEmbed(range.index, "image", imageUrl);

							// Add the <p> wrapper
							quill.insertText(range.index, "<p>", "user");
							quill.insertText(
								range.index + 1 + imageUrl.length,
								"</p>",
								"user"
							);

							hasChanges = true;
						}
					}
				}

				// Call onChange if changes were made
				if (hasChanges && onChange) {
					onChange(quill.root.innerHTML);
				}
			};

			// Run the replacement when content changes
			quill.on("text-change", replaceBase64Images);
		}
	}, [quill, pendingImages, uploadImage]);

	// Initialize editor content with value prop
	useEffect(() => {
		if (quill && value) {
			const currentContent = quill.root.innerHTML;
			// Only update content if it's different from current content
			// This prevents cursor from jumping
			if (value !== currentContent) {
				const selection = quill.getSelection();
				quill.clipboard.dangerouslyPasteHTML(value);
				// Restore selection if it existed
				if (selection) {
					setTimeout(() => quill.setSelection(selection), 0);
				}
			}
		}
	}, [quill, value]);

	// Set up change handler
	useEffect(() => {
		if (quill) {
			// Listen for text-change event
			const handleTextChange = () => {
				// Get HTML content from editor
				const content = quill.root.innerHTML;
				// Call the onChange prop with the new content
				onChange && onChange(content);
			};

			quill.on("text-change", handleTextChange);

			// Clean up event listener when component unmounts
			return () => {
				quill.off("text-change", handleTextChange);
			};
		}
	}, [quill, onChange]);

	return (
		<div className="editor-container h-[calc(100vh-210px)]">
			<div ref={quillRef} />
		</div>
	);
};

export default ReactQuill;
