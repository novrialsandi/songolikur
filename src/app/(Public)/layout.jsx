import PublicLayout from "@/lib/layout/public/Index";
// import { GoogleAnalytics } from "@next/third-parties/google";

const PublicLayout = ({ children }) => {
	return (
		<PublicLayout>
			{children}
			{/* <GoogleAnalytics gaId="G-920REJG2GY" /> */}
		</PublicLayout>
	);
};

export default PublicLayout;
