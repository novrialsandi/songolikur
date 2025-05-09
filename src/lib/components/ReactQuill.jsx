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
				if (onChange) onChange(html);
			});
		}
	}, [quill]);

	useEffect(() => {
		if (quill && initialLoad.current) {
			quill.clipboard.dangerouslyPasteHTML(value);
			initialLoad.current = false;
		} else if (quill && value !== quill.root.innerHTML) {
			quill.clipboard.dangerouslyPasteHTML(value);
		}
	}, [quill, value]);

	return (
		<div className="editor-container h-[calc(100vh-210px)]">
			<div ref={quillRef} />
		</div>
	);
};

export default ReactQuill;
