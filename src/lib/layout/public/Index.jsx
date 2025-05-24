import HeaderPublic from "./Header";

const PublicLayout = ({ children }) => {
	return (
		<div className="flex w-full justify-center">
			<div className="relative py-8 md:px-28 px-4 md:space-y-12 space-y-16 w-full max-w-[1440px]">
				<HeaderPublic />

				{children}
			</div>
		</div>
	);
};

export default PublicLayout;
