import { Open_Sans, Faculty_Glyphic } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const openSans = Open_Sans({
	variable: "--font-open-sans",
	subsets: ["latin"],
});

const facultyGlyphic = Faculty_Glyphic({
	weight: "400",

	subsets: ["latin"],
	variable: "--font-faculty-glyphic",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${facultyGlyphic.variable} antialiased`}>
				{children}
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
				/>{" "}
			</body>
		</html>
	);
}
