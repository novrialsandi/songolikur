/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://www.songolikur.id",
	generateRobotsTxt: true,
	changefreq: "weekly",
	priority: 0.7,
	trailingSlash: true,
	exclude: ["/dashboard", "/dashboard/*"],
};
