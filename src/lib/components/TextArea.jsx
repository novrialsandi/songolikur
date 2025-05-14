"use client";

import React, { useState, useRef, useEffect } from "react";

const TextArea = ({
	isFullwidth = true,
	name = "",
	id = `id-${Date.now()}`,
	className = "",
	type = "text",
	placeholder = "Type here ...",
	value: initialValue = "",
	errorMsg = "",
	label = "",
	hasIconLeft = "",
	hasIconRight = "",
	debounceTime = null, // in milliseconds
	isRequired = false,
	onKeyDown = () => {},
	onChange = () => {},
}) => {
	const [value, setValue] = useState(initialValue);
	const [inputType, setInputType] = useState(type);
	const fieldRef = useRef(null);
	const timerRef = useRef(null);

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

	return (
		<div className={`${isFullwidth ? "w-full" : ""} flex flex-col space-y-2`}>
			{label && (
				<label
					suppressHydrationWarning
					htmlFor={id}
					className="flex items-center text-page-title/7-medium text-text/light"
				>
					{label}
					{isRequired && <span className="ml-1 font-bold text-red-400">*</span>}
				</label>
			)}
			<div className={`relative ${label ? "mt-1" : ""}`}>
				{hasIconLeft && (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4">
						{hasIconLeft}
					</div>
				)}
				<textarea
					suppressHydrationWarning
					id={id}
					name={name}
					placeholder={placeholder}
					type={inputType}
					value={value}
					ref={fieldRef}
					rows={4}
					onKeyDown={onKeyDown}
					onChange={handleChange}
					className={`flex w-full items-center rounded-lg border border-[#eeeeee] py-1.5 font-normal outline-0 focus:border-active focus:ring-0 hover:border-[#333333] focus:border-primary ${className} ${
						errorMsg ? "border-error text-error" : ""
					} ${hasIconLeft ? "pl-12" : "pl-4"} ${
						hasIconRight ? "pr-10" : "pr-4"
					}`}
				/>

				{hasIconRight && (
					<div
						className={`absolute inset-y-0 right-0 flex items-center px-4 ${
							!isCheckbox ? "pointer-events-none" : ""
						}`}
					>
						{hasIconRight}{" "}
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

export default TextArea;
