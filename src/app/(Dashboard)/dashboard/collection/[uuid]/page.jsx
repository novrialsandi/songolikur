import CollectionDetail from "@/lib/views/dashboard/collection/detail/Index";

export async function generateMetadata({ params }) {
	const { uuid } = await params;

	return {
		title: "Detail Collection - Songolikur Dashboard",
		description: "Collections Detail",
		metadataBase: new URL("https://www.songolikur .id"),
		openGraph: {
			type: "website",
			url: `https://www.songolikur.vercel.app/dashboard/collection/${uuid}/`,
			title: "Detail Collection - Songolikur Dashboard",
			description: "Collections Detail",
			images: [
				{
					url: "/meta.png",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Detail Collection - Songolikur Dashboard",
			description: "Collections Detail",
			images: ["/meta.png"],
		},
	};
}

const CollectionDetailPage = () => {
	return <CollectionDetail />;
};

export default CollectionDetailPage;
