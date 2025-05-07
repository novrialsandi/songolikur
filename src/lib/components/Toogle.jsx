const ToggleButton = ({ isActive, onChange }) => {
	const handleToggle = () => {
		onChange(!isActive);
	};

	return (
		<div
			onClick={handleToggle}
			className={`${
				isActive ? "bg-primary" : "bg-gray-600"
			} relative inline-flex h-7 w-14 flex-none items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
		>
			<span
				className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
					isActive ? "translate-x-8" : "translate-x-1"
				}`}
			/>
		</div>
	);
};

export default ToggleButton;
