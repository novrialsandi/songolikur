import React from 'react';

const ToggleButton = ({ active }) => {
	return (
		<div
			className={`${
				active ? 'bg-primary' : 'bg-gray-600'
			} relative inline-flex h-7 w-14 flex-none items-center rounded-full transition-colors duration-200 ease-in-out`}
		>
			<span
				className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
					active ? 'translate-x-8' : 'translate-x-1'
				}`}
			/>
		</div>
	);
};

export default ToggleButton;
