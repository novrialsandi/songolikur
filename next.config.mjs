import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["songolikur.yomify.site"],
	},
	trailingSlash: true,
};

export default nextConfig;
