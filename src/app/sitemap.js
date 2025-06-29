export default async function sitemap() {
	const staticRoutes = [
		{
			url: "https://www.songolikur.id",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: "https://www.songolikur.id/read",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: "https://www.songolikur.id/login",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];

	const res = await fetch(`${process.env.SERVICE_HOST}/api/collection/public`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-secret-key": process.env.SECRET_KEY || "",
		},
		cache: "no-store",
	});
	const allPosts = await res.json();

	const dynamicRoutes = allPosts.data.map((post) => ({
		url: `https://www.songolikur.id/read/${post.slug}`,
		lastModified: post.publishedAt || new Date(),
		changeFrequency: "daily",
		priority: 0.8,
	}));

	return [...staticRoutes, ...dynamicRoutes];
}
