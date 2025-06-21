export const renderContent = (htmlString) => {
	if (!htmlString) return null;

	// Create a temporary div to parse HTML
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlString;

	// Helper function to get Quill class styles
	const getQuillStyles = (element) => {
		const classList = Array.from(element.classList || []);
		let styles = {};
		let className = "";

		classList.forEach((cls) => {
			// Text formatting
			if (cls === "ql-bold") styles.fontWeight = "bold";
			if (cls === "ql-italic") styles.fontStyle = "italic";
			if (cls === "ql-underline") styles.textDecoration = "underline";
			if (cls === "ql-strike") styles.textDecoration = "line-through";

			// Headers
			if (cls.startsWith("ql-header-"))
				className += ` text-${cls.replace("ql-header-", "h")}`;

			// Lists
			if (cls === "ql-list-ordered") className += " list-decimal ml-6";
			if (cls === "ql-list-bullet") className += " list-disc ml-6";

			// Indentation
			if (cls.startsWith("ql-indent-")) {
				const level = cls.replace("ql-indent-", "");
				className += ` ml-${parseInt(level) * 8}`;
			}

			// Alignment
			if (cls === "ql-align-center") className += " text-center";
			if (cls === "ql-align-right") className += " text-right";
			if (cls === "ql-align-justify") className += " text-justify";

			// Direction
			if (cls === "ql-direction-rtl") className += " direction-rtl";

			// Size
			if (cls === "ql-size-small") className += " text-sm";
			if (cls === "ql-size-large") className += " text-lg";
			if (cls === "ql-size-huge") className += " text-2xl";

			// Code block
			if (cls === "ql-code-block")
				className += " bg-gray-100 p-4 rounded font-mono text-sm";

			// Blockquote
			if (cls === "ql-blockquote")
				className += " border-l-4 border-gray-400 pl-4 italic text-gray-600";
		});

		return { styles, className: className.trim() };
	};

	// Convert HTML elements to React elements recursively
	const convertToReact = (node, index = 0) => {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent;
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const tagName = node.tagName.toLowerCase();
			const props = { key: `${tagName}-${index}-${Math.random()}` };

			// Skip ql-ui elements
			if (node.classList?.contains("ql-ui")) {
				return null;
			}

			// Get Quill styles and classes
			const { styles, className: quillClasses } = getQuillStyles(node);

			// Convert standard attributes
			for (let attr of node.attributes) {
				let propName = attr.name;
				let propValue = attr.value;

				if (propName === "class") {
					propName = "className";
					// Combine existing classes with Quill classes
					propValue = `${propValue} ${quillClasses}`.trim();
				}
				if (propName === "for") propName = "htmlFor";
				if (propName === "style" && attr.value) {
					// Parse inline styles
					const inlineStyles = {};
					attr.value.split(";").forEach((style) => {
						if (style.trim()) {
							const [property, value] = style.split(":").map((s) => s.trim());
							if (property && value) {
								// Convert CSS property to camelCase
								const camelProperty = property.replace(/-([a-z])/g, (g) =>
									g[1].toUpperCase()
								);
								inlineStyles[camelProperty] = value;
							}
						}
					});
					props.style = { ...inlineStyles, ...styles };
					continue;
				}

				props[propName] = propValue;
			}

			// Add Quill classes if no class attribute exists
			if (!node.hasAttribute("class") && quillClasses) {
				props.className = quillClasses;
			}

			// Add styles if no inline style exists
			if (!node.hasAttribute("style") && Object.keys(styles).length > 0) {
				props.style = styles;
			}

			// Handle special Quill elements

			// Handle lists with data-list attribute
			if (tagName === "ol" || tagName === "ul") {
				const listItems = Array.from(node.childNodes)
					.filter(
						(child) =>
							child.nodeType === Node.ELEMENT_NODE &&
							child.tagName.toLowerCase() === "li"
					)
					.map((child, idx) => {
						const dataList = child.getAttribute("data-list");
						const liProps = { key: `li-${idx}`, className: "mb-1" };

						// Extract content, skipping ql-ui elements
						const textContent = Array.from(child.childNodes)
							.filter(
								(n) =>
									!(
										n.nodeType === Node.ELEMENT_NODE &&
										n.classList?.contains("ql-ui")
									)
							)
							.map((n, i) => convertToReact(n, i))
							.filter((content) => content !== null && content !== "");

						return React.createElement("li", liProps, ...textContent);
					});

				// Determine list type
				const isOrdered =
					tagName === "ol" || node.querySelector('[data-list="ordered"]');
				const listTag = isOrdered ? "ol" : "ul";
				const listClass = isOrdered
					? "list-decimal ml-6 space-y-1"
					: "list-disc ml-6 space-y-1";

				return React.createElement(
					listTag,
					{
						...props,
						className: `${props.className || ""} ${listClass}`.trim(),
					},
					...listItems
				);
			}

			// Handle individual list items with data-list
			if (tagName === "li" && node.hasAttribute("data-list")) {
				const textContent = Array.from(node.childNodes)
					.filter(
						(n) =>
							!(
								n.nodeType === Node.ELEMENT_NODE &&
								n.classList?.contains("ql-ui")
							)
					)
					.map((n, i) => convertToReact(n, i))
					.filter((content) => content !== null && content !== "");

				return React.createElement(
					"li",
					{ ...props, className: `${props.className || ""} mb-1`.trim() },
					...textContent
				);
			}

			// Handle headers (h1-h6)
			if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
				const headerSizes = {
					h1: "text-3xl font-bold mb-4",
					h2: "text-2xl font-bold mb-3",
					h3: "text-xl font-bold mb-3",
					h4: "text-lg font-bold mb-2",
					h5: "text-base font-bold mb-2",
					h6: "text-sm font-bold mb-2",
				};
				props.className = `${props.className || ""} ${
					headerSizes[tagName]
				}`.trim();
			}

			// Handle paragraphs
			if (tagName === "p") {
				props.className = `${props.className || ""} mb-3`.trim();
			}

			// Handle blockquote
			if (tagName === "blockquote") {
				props.className = `${
					props.className || ""
				} border-l-4 border-gray-400 pl-4 italic text-gray-600 mb-4`.trim();
			}

			// Handle code blocks and inline code
			if (tagName === "pre") {
				props.className = `${
					props.className || ""
				} bg-gray-100 p-4 rounded overflow-x-auto mb-4`.trim();
			}
			if (tagName === "code") {
				const isBlock = node.parentElement?.tagName.toLowerCase() === "pre";
				props.className = `${props.className || ""} ${
					isBlock
						? "font-mono text-sm"
						: "bg-gray-100 px-1 rounded font-mono text-sm"
				}`.trim();
			}

			// Handle subscript and superscript
			if (tagName === "sub") {
				props.className = `${props.className || ""} text-xs`.trim();
				props.style = { ...props.style, verticalAlign: "sub" };
			}
			if (tagName === "sup") {
				props.className = `${props.className || ""} text-xs`.trim();
				props.style = { ...props.style, verticalAlign: "super" };
			}

			// Handle links
			if (tagName === "a") {
				props.className = `${
					props.className || ""
				} text-blue-600 hover:text-blue-800 underline`.trim();
			}

			// Handle images
			if (tagName === "img") {
				props.className = `${
					props.className || ""
				} max-w-full h-auto rounded mb-4`.trim();
			}

			// Handle videos
			if (tagName === "video") {
				props.className = `${
					props.className || ""
				} max-w-full h-auto rounded mb-4`.trim();
				props.controls = true;
			}

			// Convert children
			const children = Array.from(node.childNodes)
				.map((child, idx) => convertToReact(child, idx))
				.filter((child) => child !== null && child !== "");

			return React.createElement(tagName, props, ...children);
		}

		return null;
	};

	return Array.from(tempDiv.childNodes).map((node, index) =>
		convertToReact(node, index)
	);
};
