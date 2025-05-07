"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "./Button";
import { iconSvg } from "../Icons/icon";

const Dropdown = ({
	label = "",
	popupTopPosition = 90, // should be changeable based on the height of the whole page
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

	const onSelectItem = useCallback(
		(item) => {
			switch (type) {
				case "single":
					setSingleSelectedItem(item.label);
					onStateChange(item.value);
					break;
				case "multi":
					setMultipleSelectedItems((prevItems) => [...prevItems, item]);
					onStateChange([...multipleSelectedItems, item]);
					break;
				default:
					break;
			}
		},
		[
			type,
			multipleSelectedItems,
			setSingleSelectedItem,
			setMultipleSelectedItems,
			onStateChange,
		]
	);

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

	return (
		<div
			ref={wrapperRef}
			className="relative bg-white border border-black/10 active:border focus:border  rounded-lg  flex w-full flex-col gap-2"
		>
			{label && <span className="">{label}</span>}
			<button
				disabled={disabled}
				className={`${btnToggleClass} p-2`}
				placeholder={placeholder}
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
			{type === "multi" && multipleSelectedItems.length > 0 && (
				<div className="flex space-x-2">
					{multipleSelectedItems.map((item, index) => (
						<div
							key={index}
							className="inline-flex items-center gap-2  px-2 py-0.5 "
						>
							<span>{item.label}</span>
						</div>
					))}
				</div>
			)}

			{isOpen && (
				<div
					className={`no-scrollbar absolute h-fit max-h-[210px] w-full min-w-[140px] max-w-[${maxWidth}] overflow-auto rounded-lg border border-black/10  shadow-lg ${popupZIndexClass} ${
						popupPosition === "right" ? "right-0" : "left-0"
					}`}
					style={{
						top: `44px`,
						...popupStyle,
					}}
				>
					<div
						className={`no-scrollbar bg-white relative w-full overflow-y-scroll rounded-lg`}
						onClick={() => setIsOpen(!isOpen)}
					>
						<div className="no-scrollbar flex h-full  flex-col  overflow-y-scroll text-text/light dark:text-text/light">
							{items && items.length ? (
								items.map((item, index) => {
									return (
										<button
											className="flex gap-2 p-2 hover:bg-black/10"
											key={index}
											onClick={() => onSelectItem(item)}
										>
											{item.label}
										</button>
									);
								})
							) : (
								<span>No Value to select</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
