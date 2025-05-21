"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { iconSvg } from "../Icons/icon";

const Dropdown = ({
	label = "",
	popupTopPosition = 90,
	popupPosition = "left",
	disabled = false,
	popupZIndexClass = "z-10",
	popupStyle = {},
	btnToggleClass = "",
	placeholder = "Select Value",
	items = [],
	onStateChange = () => {},
	type = "single",
	hint = "",
	defaultValue = "",
	maxWidth = "1200px",
}) => {
	const [multipleSelectedItems, setMultipleSelectedItems] = useState([]);
	const [singleSelectedItem, setSingleSelectedItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);

	// Initialize default values
	useEffect(() => {
		if (type === "single" && defaultValue) {
			const selectedItem = items.find((item) => item.value === defaultValue);
			if (selectedItem) {
				setSingleSelectedItem(selectedItem.label);
			}
		} else if (type === "multi" && Array.isArray(defaultValue)) {
			const selectedItems = items.filter((item) =>
				defaultValue.includes(item.value)
			);
			setMultipleSelectedItems(selectedItems);
		}
	}, [defaultValue, items, type]);

	// Close the dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle item selection
	const onSelectItem = useCallback(
		(item) => {
			if (type === "single") {
				setSingleSelectedItem(item.label);
				onStateChange(item.value);
				setIsOpen(false);
			} else if (type === "multi") {
				const isAlreadySelected = multipleSelectedItems.some(
					(selectedItem) => selectedItem.value === item.value
				);

				const updatedItems = isAlreadySelected
					? multipleSelectedItems.filter(
							(selectedItem) => selectedItem.value !== item.value
					  )
					: [...multipleSelectedItems, item];

				setMultipleSelectedItems(updatedItems);
				onStateChange(updatedItems.map((item) => item.value));
			}
		},
		[
			multipleSelectedItems,
			setSingleSelectedItem,
			setMultipleSelectedItems,
			onStateChange,
			type,
		]
	);

	return (
		<div
			ref={wrapperRef}
			className="relative bg-white border border-black/10 active:border focus:border rounded-lg flex w-full flex-col gap-2"
		>
			{label && <span className="">{label}</span>}
			<button
				disabled={disabled}
				className={`${btnToggleClass} p-2`}
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
			>
				<div className="flex w-full items-center justify-between gap-2">
					<span
						className={`${
							!singleSelectedItem &&
							!multipleSelectedItems.length &&
							!defaultValue
								? "text-icon/disabled"
								: "text-text/light"
						}`}
					>
						{!singleSelectedItem && !multipleSelectedItems.length
							? defaultValue
								? defaultValue
								: placeholder
							: type === "single"
							? singleSelectedItem
							: `${multipleSelectedItems.length} Selected`}
					</span>
					<span
						style={{
							transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
							transition: "transform 0.15s ease",
						}}
					>
						{iconSvg.arrowDownSvg}
					</span>
				</div>
			</button>

			{/* Multi-Selected Items Display */}
			{type === "multi" && multipleSelectedItems.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2 mx-1">
					{multipleSelectedItems.map((item, index) => (
						<div
							key={index}
							className="bg-primary text-secondary rounded-md px-3 py-1 text-sm flex items-center gap-2"
						>
							<span>{item.label}</span>
						</div>
					))}
				</div>
			)}

			{/* Dropdown Items */}
			{isOpen && (
				<div
					className={` absolute h-fit max-h-[122px] w-full min-w-[140px] max-w-[${maxWidth}] overflow-auto rounded-lg border border-black/10 shadow-lg ${popupZIndexClass} ${
						popupPosition === "right" ? "right-0" : "left-0"
					}`}
					style={{
						top: `44px`,
						...popupStyle,
					}}
				>
					<div className="no-scrollbar bg-white relative w-full overflow-y-scroll rounded-lg">
						<div className="no-scrollbar flex h-full flex-col overflow-y-scroll text-text/light dark:text-text/light">
							{items && items.length ? (
								items.map((item, index) => {
									const isSelected =
										type === "multi"
											? multipleSelectedItems.some(
													(selectedItem) => selectedItem.value === item.value
											  )
											: singleSelectedItem === item.label;

									return (
										<button
											className={`flex gap-2 p-2 rounded-md hover:bg-gray-100`}
											key={index}
											onClick={() => onSelectItem(item)}
										>
											{item.label}
											{isSelected && (
												<span className="ml-auto text-sm text-black">
													&#10003;
												</span>
											)}
										</button>
									);
								})
							) : (
								<span className="p-2">No Value to select</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
