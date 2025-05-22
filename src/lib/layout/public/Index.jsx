import HeaderPublic from "./Header";

const PublicLayout = ({ children }) => {
	return (
		<div className="flex w-full justify-center">
			<div className="relative py-8 md:px-28 px-4 space-y-12 w-full max-w-[1440px]">
				<HeaderPublic />

				{children}
			</div>
		</div>
	);
};

export default PublicLayout;
