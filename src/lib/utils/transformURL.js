export const transformURL = (url) => {
	const filename = url.split("/").pop();
	return `https://image.yomify.site/${filename}`;
};

export const replaceImageURLsInContent = (content) => {
	return content.replace(
		/src="https:\/\/[^"]*r2\.dev\/([^"]+)"/g,
		`src="https://image.yomify.site/$1"`
	);
};
