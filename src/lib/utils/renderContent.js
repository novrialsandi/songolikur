import React from "react";

/**
 * Server-safe HTML content renderer for Quill editor output
 * Handles both SSR and client-side rendering without hydration mismatch
 *
 * @param {string} htmlString - HTML string from Quill editor
 * @returns {React.ReactElement} - Rendered React component
 */
export const renderContent = (htmlString) => {
	if (!htmlString) return null;

	// Always use the same approach for both server and client
	// This ensures consistent HTML structure for hydration
	return (
		<div
			className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h1:text-3xl prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mb-3  
        prose-h3:text-xl prose-h3:mb-3
        prose-h4:text-lg prose-h4:mb-2
        prose-h5:text-base prose-h5:mb-2
        prose-h6:text-sm prose-h6:mb-2
        prose-p:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-a:transition-colors
        prose-strong:font-bold prose-em:italic
        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-1 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-1 prose-ol:mb-4
        prose-li:mb-1 prose-li:leading-relaxed
        prose-blockquote:border-l-4 prose-blockquote:border-gray-400 
        prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:mb-4
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-gray-800
        prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:mb-4 prose-pre:text-sm
        prose-img:max-w-full prose-img:h-auto prose-img:rounded prose-img:mb-4 prose-img:shadow-sm
        prose-video:max-w-full prose-video:h-auto prose-video:rounded prose-video:mb-4 prose-video:shadow-sm
        prose-table:w-full prose-table:mb-4
        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:font-semibold
        prose-td:border prose-td:border-gray-300 prose-td:p-2
        
        // Quill-specific class handlers using Tailwind's arbitrary value selectors
        [&_.ql-bold]:font-bold
        [&_.ql-italic]:italic
        [&_.ql-underline]:underline
        [&_.ql-strike]:line-through
        [&_.ql-align-center]:text-center
        [&_.ql-align-right]:text-right
        [&_.ql-align-justify]:text-justify
        [&_.ql-direction-rtl]:direction-rtl
        
        // Quill font sizes
        [&_.ql-size-small]:text-sm
        [&_.ql-size-large]:text-lg
        [&_.ql-size-huge]:text-2xl
        
        // Quill headers
        [&_.ql-header-1]:text-3xl [&_.ql-header-1]:font-bold [&_.ql-header-1]:mb-4
        [&_.ql-header-2]:text-2xl [&_.ql-header-2]:font-bold [&_.ql-header-2]:mb-3
        [&_.ql-header-3]:text-xl [&_.ql-header-3]:font-bold [&_.ql-header-3]:mb-3
        [&_.ql-header-4]:text-lg [&_.ql-header-4]:font-bold [&_.ql-header-4]:mb-2
        [&_.ql-header-5]:text-base [&_.ql-header-5]:font-bold [&_.ql-header-5]:mb-2
        [&_.ql-header-6]:text-sm [&_.ql-header-6]:font-bold [&_.ql-header-6]:mb-2
        
        // Quill code blocks and blockquotes
        [&_.ql-code-block]:bg-gray-100 [&_.ql-code-block]:p-4 [&_.ql-code-block]:rounded [&_.ql-code-block]:font-mono [&_.ql-code-block]:text-sm [&_.ql-code-block]:overflow-x-auto [&_.ql-code-block]:mb-4
        [&_.ql-blockquote]:border-l-4 [&_.ql-blockquote]:border-gray-400 [&_.ql-blockquote]:pl-4 [&_.ql-blockquote]:italic [&_.ql-blockquote]:text-gray-600 [&_.ql-blockquote]:mb-4
        
        // Quill lists
        [&_.ql-list-ordered]:list-decimal [&_.ql-list-ordered]:ml-6 [&_.ql-list-ordered]:space-y-1
        [&_.ql-list-bullet]:list-disc [&_.ql-list-bullet]:ml-6 [&_.ql-list-bullet]:space-y-1
        
        // Quill indentation levels
        [&_.ql-indent-1]:ml-8
        [&_.ql-indent-2]:ml-16
        [&_.ql-indent-3]:ml-24
        [&_.ql-indent-4]:ml-32
        [&_.ql-indent-5]:ml-40
        [&_.ql-indent-6]:ml-48
        [&_.ql-indent-7]:ml-56
        [&_.ql-indent-8]:ml-64
        
        // Quill colors (common ones)
        [&_.ql-color-red]:text-red-600
        [&_.ql-color-orange]:text-orange-600
        [&_.ql-color-yellow]:text-yellow-600
        [&_.ql-color-green]:text-green-600
        [&_.ql-color-blue]:text-blue-600
        [&_.ql-color-purple]:text-purple-600
        [&_.ql-color-gray]:text-gray-600
        
        // Quill background colors
        [&_.ql-bg-red]:bg-red-100
        [&_.ql-bg-orange]:bg-orange-100
        [&_.ql-bg-yellow]:bg-yellow-100
        [&_.ql-bg-green]:bg-green-100
        [&_.ql-bg-blue]:bg-blue-100
        [&_.ql-bg-purple]:bg-purple-100
        [&_.ql-bg-gray]:bg-gray-100
        
        // Quill fonts
        [&_.ql-font-serif]:font-serif
        [&_.ql-font-monospace]:font-mono
      "
			dangerouslySetInnerHTML={{ __html: enhanceHtmlContent(htmlString) }}
		/>
	);
};

/**
 * Enhanced HTML processing function
 * Cleans up Quill HTML and adds proper CSS classes
 *
 * @param {string} htmlString - Raw HTML from Quill
 * @returns {string} - Enhanced HTML with proper styling
 */
const enhanceHtmlContent = (htmlString) => {
	if (!htmlString) return "";

	let processedHtml = htmlString;

	// Remove ql-ui elements completely (Quill UI artifacts)
	processedHtml = processedHtml.replace(
		/<[^>]*class="[^"]*ql-ui[^"]*"[^>]*>.*?<\/[^>]*>/gs,
		""
	);
	processedHtml = processedHtml.replace(
		/<[^>]*class="[^"]*ql-ui[^"]*"[^>]*\/>/g,
		""
	);
	processedHtml = processedHtml.replace(
		/<span[^>]*class="[^"]*ql-ui[^"]*"[^>]*><\/span>/g,
		""
	);

	// Handle self-closing ql-ui elements
	processedHtml = processedHtml.replace(/<[^>]*ql-ui[^>]*\/>/g, "");

	// Remove empty ql-cursor elements
	processedHtml = processedHtml.replace(
		/<span[^>]*ql-cursor[^>]*><\/span>/g,
		""
	);

	// Handle lists with data-list attributes properly
	processedHtml = processedHtml.replace(
		/<li([^>]*data-list="ordered"[^>]*)>/g,
		'<li$1 class="mb-1 leading-relaxed">'
	);
	processedHtml = processedHtml.replace(
		/<li([^>]*data-list="bullet"[^>]*)>/g,
		'<li$1 class="mb-1 leading-relaxed">'
	);
	processedHtml = processedHtml.replace(
		/<li([^>]*data-list="unchecked"[^>]*)>/g,
		'<li$1 class="mb-1 leading-relaxed list-none">☐ '
	);
	processedHtml = processedHtml.replace(
		/<li([^>]*data-list="checked"[^>]*)>/g,
		'<li$1 class="mb-1 leading-relaxed list-none">☑ '
	);

	// Ensure proper list styling for standard lists
	processedHtml = processedHtml.replace(
		/<ol(?!\s[^>]*class=)([^>]*)>/g,
		'<ol$1 class="list-decimal ml-6 space-y-1 mb-4">'
	);
	processedHtml = processedHtml.replace(
		/<ul(?!\s[^>]*class=)([^>]*)>/g,
		'<ul$1 class="list-disc ml-6 space-y-1 mb-4">'
	);

	// Add proper spacing and styling to common elements (only if they don't already have classes)
	const elementEnhancements = [
		// Headers
		{
			from: /<h1(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h1$1 class="text-3xl font-bold mb-4 text-gray-900">',
		},
		{
			from: /<h2(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h2$1 class="text-2xl font-bold mb-3 text-gray-900">',
		},
		{
			from: /<h3(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h3$1 class="text-xl font-bold mb-3 text-gray-900">',
		},
		{
			from: /<h4(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h4$1 class="text-lg font-bold mb-2 text-gray-900">',
		},
		{
			from: /<h5(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h5$1 class="text-base font-bold mb-2 text-gray-900">',
		},
		{
			from: /<h6(?!\s[^>]*class=)([^>]*)>/g,
			to: '<h6$1 class="text-sm font-bold mb-2 text-gray-900">',
		},

		// Paragraphs
		{
			from: /<p(?!\s[^>]*class=)([^>]*)>/g,
			to: '<p$1 class="mb-3 text-gray-700 leading-relaxed">',
		},

		// Blockquotes
		{
			from: /<blockquote(?!\s[^>]*class=)([^>]*)>/g,
			to: '<blockquote$1 class="border-l-4 border-gray-400 pl-4 italic text-gray-600 mb-4 bg-gray-50 py-2 rounded-r">',
		},

		// Code blocks
		{
			from: /<pre(?!\s[^>]*class=)([^>]*)>/g,
			to: '<pre$1 class="bg-gray-100 p-4 rounded overflow-x-auto mb-4 font-mono text-sm border">',
		},

		// Inline code
		{
			from: /<code(?!\s[^>]*class=)([^>]*)>/g,
			to: '<code$1 class="bg-gray-100 px-2 py-1 rounded font-mono text-sm text-gray-800">',
		},

		// Links
		{
			from: /<a(?!\s[^>]*class=)([^>]*)>/g,
			to: '<a$1 class="text-blue-600 hover:text-blue-800 underline transition-colors duration-200">',
		},

		// Images
		{
			from: /<img(?!\s[^>]*class=)([^>]*)>/g,
			to: '<img$1 class="max-w-full h-auto rounded mb-4 shadow-sm border">',
		},

		// Videos
		{
			from: /<video(?!\s[^>]*class=)([^>]*)>/g,
			to: '<video$1 class="max-w-full h-auto rounded mb-4 shadow-sm border" controls>',
		},

		// Tables
		{
			from: /<table(?!\s[^>]*class=)([^>]*)>/g,
			to: '<table$1 class="w-full mb-4 border-collapse border border-gray-300 rounded overflow-hidden">',
		},
		{
			from: /<th(?!\s[^>]*class=)([^>]*)>/g,
			to: '<th$1 class="border border-gray-300 bg-gray-50 p-3 font-semibold text-left">',
		},
		{
			from: /<td(?!\s[^>]*class=)([^>]*)>/g,
			to: '<td$1 class="border border-gray-300 p-3">',
		},
		{
			from: /<tr(?!\s[^>]*class=)([^>]*)>/g,
			to: '<tr$1 class="hover:bg-gray-50">',
		},

		// Dividers
		{
			from: /<hr(?!\s[^>]*class=)([^>]*)>/g,
			to: '<hr$1 class="my-6 border-gray-300">',
		},

		// Strong and emphasis
		{
			from: /<strong(?!\s[^>]*class=)([^>]*)>/g,
			to: '<strong$1 class="font-bold text-gray-900">',
		},
		{ from: /<em(?!\s[^>]*class=)([^>]*)>/g, to: '<em$1 class="italic">' },

		// Subscript and superscript
		{ from: /<sub(?!\s[^>]*class=)([^>]*)>/g, to: '<sub$1 class="text-xs">' },
		{ from: /<sup(?!\s[^>]*class=)([^>]*)>/g, to: '<sup$1 class="text-xs">' },
	];

	elementEnhancements.forEach(({ from, to }) => {
		processedHtml = processedHtml.replace(from, to);
	});

	// Handle Quill formula (if using mathquill)
	processedHtml = processedHtml.replace(
		/<span class="ql-formula"([^>]*)>/g,
		'<span class="ql-formula bg-gray-100 px-2 py-1 rounded font-mono text-sm"$1>'
	);

	// Clean up any empty paragraphs or elements
	processedHtml = processedHtml.replace(/<p[^>]*>\s*<\/p>/g, "");
	processedHtml = processedHtml.replace(/<div[^>]*>\s*<\/div>/g, "");
	processedHtml = processedHtml.replace(/<span[^>]*>\s*<\/span>/g, "");

	// Clean up multiple consecutive <br> tags
	processedHtml = processedHtml.replace(/(<br\s*\/?>\s*){3,}/g, "<br><br>");

	// Add proper spacing after <br> tags
	processedHtml = processedHtml.replace(/<br\s*\/?>/g, '<br class="mb-2">');

	return processedHtml;
};

/**
 * Alternative client-only version for complex cases
 * Use this if you need to ensure client-only rendering
 *
 * @param {Object} props - Component props
 * @param {string} props.htmlString - HTML string to render
 * @returns {React.ReactElement} - Client-only rendered component
 */
export const ClientOnlyRenderContent = ({ htmlString }) => {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Return skeleton loader or same structure as client-side for hydration
		return (
			<div className="prose prose-lg max-w-none animate-pulse">
				<div className="h-4 bg-gray-200 rounded mb-3"></div>
				<div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
				<div className="h-4 bg-gray-200 rounded mb-3"></div>
				<div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
			</div>
		);
	}

	return renderContent(htmlString);
};

/**
 * Simple wrapper for basic HTML content without Quill-specific processing
 * Use this for simple HTML that doesn't come from Quill
 *
 * @param {string} htmlString - Simple HTML string
 * @returns {React.ReactElement} - Basic rendered content
 */
export const renderSimpleContent = (htmlString) => {
	if (!htmlString) return null;

	return (
		<div
			className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-p:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
        prose-strong:font-bold prose-em:italic
        prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6
        prose-img:max-w-full prose-img:h-auto prose-img:rounded
        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
      "
			dangerouslySetInnerHTML={{ __html: htmlString }}
		/>
	);
};

// Default export
export default renderContent;
