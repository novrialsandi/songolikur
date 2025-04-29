import { useState, useEffect, useRef } from "react";

const QuillEditor = ({ onChange }) => {
	const [quill, setQuill] = useState(null);
	const editorRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	useEffect(() => {
		const loadQuill = async () => {
			if (typeof window !== "undefined" && !isLoaded) {
				if (!document.getElementById("quill-css")) {
					const quillCss = document.createElement("link");
					quillCss.id = "quill-css";
					quillCss.rel = "stylesheet";
					quillCss.href =
						"https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
					document.head.appendChild(quillCss);
				}

				if (!document.getElementById("quill-js")) {
					const quillScript = document.createElement("script");
					quillScript.id = "quill-js";
					quillScript.src =
						"https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
					quillScript.async = true;

					quillScript.onload = () => {
						if (editorRef.current && window.Quill) {
							const customImageHandler = () => {
								selectLocalImage();
							};

							const quillInstance = new window.Quill(editorRef.current, {
								theme: "snow",
								placeholder: "Write your story...",
								modules: {
									toolbar: {
										container: [
											[{ header: "1" }, { header: "2" }, { font: [] }],
											[{ list: "ordered" }, { list: "bullet" }],
											["bold", "italic", "underline", "strike"],
											[{ color: [] }, { background: [] }],
											["link", "image"],
											["clean"],
										],
										handlers: {
											image: customImageHandler,
										},
									},
								},
							});

							// Listen for text changes
							quillInstance.on("text-change", () => {
								onChange(quillInstance.root.innerHTML);
							});

							// Drag and drop images
							quillInstance.root.addEventListener("drop", handleDropImage);
							quillInstance.root.addEventListener("paste", handlePasteImage);

							setQuill(quillInstance);
						}
					};

					document.body.appendChild(quillScript);
				}
				setIsLoaded(true);
			}
		};

		loadQuill();

		// Cleanup function
		return () => {
			// Check if quill exists and has a destroy method
			if (quill && typeof quill.destroy === "function") {
				quill.destroy();
			}

			// Additional cleanup to remove event listeners
			if (quill && quill.root) {
				quill.root.removeEventListener("drop", handleDropImage);
				quill.root.removeEventListener("paste", handlePasteImage);
			}
		};
	}, [isLoaded, onChange]);

	// Handle select local image (click image button)
	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = () => {
			const file = input.files?.[0];
			if (file) {
				uploadImage(file);
			}
		};
	};

	// Handle drag-drop upload
	const handleDropImage = (e) => {
		e.preventDefault();
		if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
			const file = e.dataTransfer.files[0];
			if (file.type.startsWith("image/")) {
				uploadImage(file);
			}
		}
	};

	// Handle paste upload
	const handlePasteImage = (e) => {
		const clipboardData = e.clipboardData;
		if (clipboardData && clipboardData.items) {
			for (let i = 0; i < clipboardData.items.length; i++) {
				const item = clipboardData.items[i];
				if (item.type.startsWith("image/")) {
					const file = item.getAsFile();
					if (file) {
						uploadImage(file);
					}
				}
			}
		}
	};

	// Upload image to server
	const uploadImage = async (file) => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "/image/collection", true);

			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded / e.total) * 100);
					setUploadProgress(percent);
				}
			};

			xhr.onload = () => {
				if (xhr.status === 200) {
					const { url } = JSON.parse(xhr.responseText);
					insertToEditor(url);
				} else {
					console.error("Upload failed");
				}
				setUploadProgress(0); // Reset progress
			};

			xhr.onerror = () => {
				console.error("Upload error");
				setUploadProgress(0);
			};

			xhr.send(formData);
		} catch (error) {
			console.error("Upload failed:", error);
			setUploadProgress(0);
		}
	};

	// Insert uploaded image into editor
	const insertToEditor = (url) => {
		if (quill) {
			const range = quill.getSelection() || { index: 0 };
			quill.insertEmbed(range.index, "image", url);
		}
	};

	return (
		<div className="relative">
			{/* Upload progress bar */}
			{uploadProgress > 0 && (
				<div className="w-full h-2 bg-gray-200 rounded mb-2 overflow-hidden">
					<div
						className="h-full bg-blue-500 transition-all"
						style={{ width: `${uploadProgress}%` }}
					></div>
				</div>
			)}

			{/* Editor */}
			<div ref={editorRef} className="min-h-64"></div>
		</div>
	);
};

export default QuillEditor;
