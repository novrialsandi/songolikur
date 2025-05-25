"use client";

import { useState, useRef, useEffect } from "react";
import { iconSvg } from "@/lib/Icons/icon";

const TextInput = ({
	width = "w-full",
	name = "",
	id = `id-${Date.now()}`,
	className = "",
	type = "text",
	placeholder = "Type here ...",
	pattern = "",
	value: propValue = "", // ✅ Rename back to propValue untuk clarity
	errorMsg = "",
	label = "",
	size = "medium", // small, medium, large
	hasIconLeft = "",
	hasIconRight = "",
	isCheckbox = false,
	isPasswordField = false,
	debounceTime = null, // in milliseconds
	isRequired = false,
	isDisabled = false,
	onKeyDown = () => {},
	onChange = () => {},
	onFocus = () => {},
	onBlur = () => {},
}) => {
	const [value, setValue] = useState(propValue);
	const [inputType, setInputType] = useState(type);
	const fieldRef = useRef(null);
	const timerRef = useRef(null);

	const sizeDataClass = {
		small: "h-8",
		medium: "h-12",
		large: "h-[60px]",
	};

	// ✅ ADD: Sync internal state dengan prop value
	useEffect(() => {
		setValue(propValue);
	}, [propValue]);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	const debounce = (e) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			setValue(e.target.value);
			onChange(e);
		}, debounceTime);
	};

	const handleChange = (e) => {
		if (debounceTime) {
			debounce(e);
		} else {
			setValue(e.target.value);
			onChange(e);
		}
	};

	const togglePasswordVisibility = (e) => {
		e.preventDefault();
		setInputType((prevType) => (prevType === "password" ? "text" : "password"));
		fieldRef.current.focus();
	};

	return (
		<div className={`${width} flex flex-col`}>
			{label && (
				<label
					suppressHydrationWarning
					htmlFor={id}
					className="flex items-center"
				>
					{label}
					{isRequired && <span className="ml-1 font-bold text-red-400">*</span>}
				</label>
			)}
			<div className={`relative ${label ? "mt-1" : ""}`}>
				{hasIconLeft && (
					<div
						className={`pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 ${
							size === "small" ? "" : "pl-6"
						} `}
					>
						{hasIconLeft}
					</div>
				)}
				<input
					suppressHydrationWarning
					id={id}
					name={name}
					placeholder={placeholder}
					type={inputType}
					pattern={pattern}
					value={value}
					ref={fieldRef}
					autoComplete="off"
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					onFocus={onFocus}
					onChange={handleChange}
					disabled={isDisabled}
					style={{ fontSize: "16px" }}
					className={`flex w-full items-center rounded-md border border-[#CDD5DF] outline-0 focus:border-active focus:ring-0 hover:border-[#333333] focus:border-primary ${className} ${
						errorMsg ? "border-error text-error" : ""
					} ${sizeDataClass[size]} ${
						hasIconLeft ? (size === "small" ? "pl-10" : "pl-14") : "pl-4"
					} ${hasIconRight || isPasswordField ? "pr-10" : "pr-4"} ${
						isDisabled ? "bg-gray-200 cursor-not-allowed text-gray-500" : ""
					}`}
					required={isRequired}
				/>
				{isPasswordField && (
					<div className="absolute inset-y-0 right-0 flex items-center px-6">
						<button
							onClick={togglePasswordVisibility}
							disabled={isDisabled}
							className={`${isDisabled ? "cursor-not-allowed" : ""}`}
						>
							{inputType === "password"
								? iconSvg.eyeOpenSvg
								: iconSvg.eyeCloseSvg}
						</button>
					</div>
				)}
				{hasIconRight && !isPasswordField && (
					<div
						className={`absolute inset-y-0 right-0 flex items-center px-4 ${
							!isCheckbox ? "pointer-events-none" : ""
						}`}
					>
						{hasIconRight}
					</div>
				)}
			</div>
			{errorMsg && (
				<p className="mt-1 text-red-500 transition duration-150 ease-in-out">
					{errorMsg}
				</p>
			)}
		</div>
	);
};

export default TextInput;
