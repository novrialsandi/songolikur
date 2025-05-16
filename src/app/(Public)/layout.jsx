import Layout from "@/lib/layout/public/Index";
// import { GoogleAnalytics } from "@next/third-parties/google";

const PublicLayout = ({ children }) => {
	return (
		<Layout>
			{children}
			{/* <GoogleAnalytics gaId="G-920REJG2GY" /> */}
		</Layout>
	);
};

export default PublicLayout;
