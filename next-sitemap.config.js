/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://www.saelab.id",
	generateRobotsTxt: true,
	changefreq: "weekly",
	priority: 0.7,
	trailingSlash: true,
	exclude: ["/dashboard", "/dashboard/*"],
};
