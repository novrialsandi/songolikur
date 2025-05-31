export const transformURL = (url) => {
	const filename = url.split("/").pop();
	return `https://image.yomify.site/${filename}`;
};

export const reverseTransformURL = (url) => {
	const filename = url.split("/").pop();
	return `https://pub-5bcfca0c614843a19ac29eb57fd00774.r2.dev/${filename}`;
};

export const replaceImageURLsInContent = (content) => {
	return content.replace(
		/src="https:\/\/[^"]*r2\.dev\/([^"]+)"/g,
		`src="https://image.yomify.site/$1"`
	);
};

export const ReverseReplaceImageURLsInContent = (content) => {
	return content.replace(
		/src="https:\/\/image\.yomify\.site\/([^"]+)"/g,
		`src="https://pub-5bcfca0c614843a19ac29eb57fd00774.r2.dev/$1"`
	);
};
