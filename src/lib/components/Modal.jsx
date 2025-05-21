"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { iconSvg } from "../Icons/icon";

const Modal = ({
	position = "center",
	className,
	children,
	visible,
	onClose = () => {},
	preventClose = false,
}) => {
	const modalRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (preventClose) {
				return;
			} else if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	useEffect(() => {
		if (visible) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [visible]);

	const getInitialPosition = () => {
		switch (position) {
			case "left":
				return { x: "-100%" };
			case "right":
				return { x: "100%" };
			case "top":
				return { y: "-100%" };
			case "bottom":
				return { y: "100%" };
			case "center":
				return { scale: 0.9, opacity: 0 };
			default:
				return { x: "100%" };
		}
	};

	const getAnimatePosition = () => {
		switch (position) {
			case "left":
			case "right":
				return { x: "0%" };
			case "top":
			case "bottom":
				return { y: "0%" };
			case "center":
				return { scale: 1, opacity: 1 };
			default:
				return { x: "0%" };
		}
	};

	const getExitPosition = () => {
		switch (position) {
			case "left":
				return { x: "-100%" };
			case "right":
				return { x: "100%" };
			case "top":
				return { y: "-100%" };
			case "bottom":
				return { y: "100%" };
			case "center":
				return { scale: 0.9, opacity: 0 };
			default:
				return { x: "100%" };
		}
	};

	const getModalPosition = () => {
		switch (position) {
			case "left":
				return "items-center justify-start";
			case "right":
				return "items-center justify-end";
			case "top":
				return "items-start justify-center";
			case "bottom":
				return "items-end justify-center";
			case "center":
				return "items-center justify-center";
			default:
				return "items-center justify-end";
		}
	};

	return (
		<AnimatePresence mode="wait">
			{visible && (
				<motion.div
					key="modal-overlay"
					className={`fixed inset-0 z-10 flex min-h-screen bg-black/80 p-4 ${getModalPosition()}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						key="modal-content"
						ref={modalRef}
						className={`modal-content z-10 border  ${className} relative my-8 min-w-[400px] max-w-[1200px] overflow-hidden rounded-lg bg-white`}
						initial={getInitialPosition()}
						animate={getAnimatePosition()}
						exit={getExitPosition()}
						transition={{ type: "tween", duration: 0.3 }}
					>
						<button
							className="absolute right-4 top-4 rounded-lg  transition-all duration-100 cursor-pointer"
							onClick={() => onClose(false)}
						>
							{iconSvg.closeSvg}
						</button>

						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
