import "./globals.css";
import { Faculty_Glyphic } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { GoogleAnalytics } from "@next/third-parties/google";

const facultyGlyphic = Faculty_Glyphic({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "NewsMediaOrganization",
	name: "Songolikur",
	url: "https://www.songolikur.id",
	logo: {
		"@type": "ImageObject",
		url: "https://www.songolikur.id/meta.png",
	},
	description: "Discover Yogyakarta Culture & Football",
	contactPoint: {
		"@type": "ContactPoint",
		email: "songolikurid@gmail.com",
		contactType: "Admin",
	},
	// ethicsPolicy: "https://www.songolikur.id/kebijakan-etik",
	// masthead: "https://www.songolikur.id/redaksi",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${facultyGlyphic.className} antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				{children}
				<GoogleAnalytics gaId="G-920REJG2GY" />
				<ToastContainer
					position="top-center"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss={false}
					draggable={false}
					pauseOnHover={false}
					theme="light"
				/>
			</body>
		</html>
	);
}
