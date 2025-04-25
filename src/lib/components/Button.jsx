const Button = ({
	className = "",
	isLoading = false,
	disabled = false,
	onClick = () => {},
	children,
	size = "medium", // small, medium, large
}) => {
	const sizeDataClass = {
		small: "h-8",
		medium: "h-[37px]",
		large: "h-[60px]",
	};

	const handleClick = (e) => {
		if (e && typeof e.stopPropagation === "function") {
			e.stopPropagation();
		}
		if (!isLoading) {
			onClick(e);
		}
	};

	return (
		<button
			className={`min-w-24 ${className}  ${sizeDataClass[size]} text-white bg-primary hover:bg-[#021B79]
			}  text-nowrap flex items-center justify-center cursor-pointer`}
			disabled={disabled || isLoading}
			onClick={handleClick}
		>
			{isLoading ? (
				<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
