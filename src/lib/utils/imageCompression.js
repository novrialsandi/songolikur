import imageCompression from "browser-image-compression";

export const compressImage = async (file, options = {}) => {
	const {
		maxWidthOrHeight = 1080,
		maxSizeMB = 1,
		initialQuality = 1,
	} = options;

	try {
		const compressedFile = await imageCompression(file, {
			maxWidthOrHeight,
			maxSizeMB,
			initialQuality,
			useWebWorker: true,
		});
		return compressedFile;
	} catch (error) {
		console.error("Compression failed:", error);
		throw error;
	}
};
