import { useState, useEffect, useRef } from "react";

const MediumLikeEditor = ({ onChange }) => {
	const [quill, setQuill] = useState(null);
	const editorRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load Quill only once
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
							const quillInstance = new window.Quill(editorRef.current, {
								theme: "snow",
								placeholder: "Write your story...",
								modules: {
									toolbar: [
										[{ header: "1" }, { header: "2" }, { font: [] }],
										[{ list: "ordered" }, { list: "bullet" }],
										["bold", "italic", "underline", "strike"],
										[{ color: [] }, { background: [] }],
										["link", "image"],
										["clean"],
									],
								},
							});

							// Listen for content change
							quillInstance.on("text-change", () => {
								onChange(quillInstance.root.innerHTML);
							});

							setQuill(quillInstance);
						}
					};

					document.body.appendChild(quillScript);
				}
				setIsLoaded(true);
			}
		};

		loadQuill();

		return () => {
			if (quill) {
				quill.destroy();
			}
		};
	}, [isLoaded, onChange]);

	return (
		<div className="relative">
			<div ref={editorRef} className="min-h-64 borderrounded-md"></div>
		</div>
	);
};

export default MediumLikeEditor;
