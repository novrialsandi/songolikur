import "./globals.css";
import { Faculty_Glyphic, Open_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";

const facultyGlyphic = Faculty_Glyphic({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${facultyGlyphic.className} antialiased`}>
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
