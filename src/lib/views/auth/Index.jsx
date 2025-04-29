"use client";

import Button from "@/lib/components/Button";
import TextInput from "@/lib/components/TextInput";
import { useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/stores";
import { motion, AnimatePresence } from "framer-motion";
import { setCookie } from "@/lib/helpers/cookie";
import fetchApi from "@/lib/api/fetchApi";

const Login = () => {
	const { setSession } = useSessionStore();
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [userAuth, setUserAuth] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [errorMsg, setErrorMsg] = useState("");

	const formVariants = {
		initial: { opacity: 0, x: 50 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -50 },
	};

	const isFormValid = isLogin
		? userAuth.email.trim() !== "" && userAuth.password.trim() !== ""
		: userAuth.name.trim() !== "" &&
		  userAuth.email.trim() !== "" &&
		  userAuth.password.trim() !== "";

	const onAuth = async () => {
		setIsLoading(true);
		try {
			if (isLogin) {
				const req = await fetchApi.post("/auth/login", {
					email: userAuth.email,
					password: userAuth.password,
				});

				if (req.status === 200) {
					setCookie("sid", req.data.token);
					setCookie("cid", req.data.user);
					setErrorMsg("");

					router.replace("/");
				}
			} else if (!isLogin) {
				// const req = await fetchApi.post("/auth/register", {
				// 	name: userAuth.name,
				// 	email: userAuth.email,
				// 	password: userAuth.password,
				// });
				// if (req.status === 201) {
				// 	setCookie("cid", req.data.user);
				// 	setErrorMsg("");
				// 	router.replace("/");
				// }
			}
		} catch (error) {
			setErrorMsg(error.response.data.message);

			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const inputLogin = (e) => {
		const { name, value } = e.target;
		setUserAuth((prevAuth) => ({
			...prevAuth,
			[name]: value,
		}));
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			onAuth(); // Trigger login on Enter key press
		}
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
			{/* Left side - Brand section */}
			<div
				style={{
					background: "linear-gradient(to top, #021B79, #02298A, #0575E6)",
				}}
				className="w-full md:w-1/2 lg:w-3/5 min-h-[30vh] md:h-screen relative text-white flex flex-col justify-center items-center p-6"
			>
				<div className="absolute left-0 bottom-0 translate-y-1/2 -translate-x-1/3 size-[300px] md:size-[400px] lg:size-[557px] border border-[#0575E6] rounded-full opacity-50"></div>
				<div className="absolute left-0 bottom-0 translate-y-2/5 -translate-x-1/2 size-[300px] md:size-[400px] lg:size-[557px] border border-[#0575E6] rounded-full opacity-50"></div>
				<div className="flex flex-col justify-between gap-6 z-10">
					<div className="text-center md:text-left">
						<div className="font-bold text-3xl md:text-[40px]">GoFinance</div>
						<div className="text-base md:text-lg">
							Lorem ipsoum dolor sit amet
						</div>
					</div>

					<Button className="w-[135px] rounded-full text-sm mx-auto md:mx-0">
						Read More
					</Button>
				</div>
			</div>

			{/* Right side - Form section */}
			<div className="w-full md:w-1/2 lg:w-2/5 text-[#333333] bg-white flex flex-col justify-center items-center p-6 md:p-8 min-h-[60vh] md:h-screen">
				<AnimatePresence mode="wait">
					{isLogin ? (
						<motion.div
							key="login"
							variants={formVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.4 }}
							className="w-full max-w-[307px] gap-6 md:gap-8 flex flex-col justify-between"
						>
							<div className="text-center md:text-left">
								<div className="font-bold text-2xl md:text-[26px]">
									Hello Again!
								</div>
								<div className="text-base md:text-lg">Welcome Back</div>
							</div>
							<div className="flex flex-col items-center gap-4">
								<TextInput
									size="large"
									name="email"
									type="email"
									hasIconLeft={iconSvg.email}
									placeholder="Email Address"
									value={userAuth.email}
									onChange={inputLogin}
									onKeyDown={handleKeyDown}
									className="w-full"
								/>
								<TextInput
									isPasswordField
									size="large"
									name="password"
									type="password"
									hasIconLeft={iconSvg.password}
									placeholder="Password"
									value={userAuth.password}
									onChange={inputLogin}
									onKeyDown={handleKeyDown}
									className="w-full"
								/>
								<div className="w-full flex flex-col gap-2">
									{errorMsg && (
										<p className="text-red-500 text-sm text-center">
											{errorMsg}
										</p>
									)}

									<Button
										isLoading={isLoading}
										disabled={!isFormValid || isLoading}
										size="large"
										className="w-full rounded-full"
										onClick={onAuth}
									>
										Login
									</Button>
								</div>
								<div className="text-sm text-[#333333] text-center w-full">
									<div className="text-sm text-[#333333] cursor-pointer mb-2">
										Forget Password
									</div>
									Don't have an account?{" "}
									<span
										className="text-blue-600 cursor-pointer font-semibold"
										onClick={() => {
											setIsLogin(false);
											setErrorMsg("");
										}}
									>
										Sign Up
									</span>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="register"
							variants={formVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.4 }}
							className="w-full max-w-[307px] gap-6 md:gap-8 flex flex-col justify-between"
						>
							<div className="text-center md:text-left">
								<div className="font-bold text-2xl md:text-[26px]">
									Join Us!
								</div>
								<div className="text-base md:text-lg">Create your account</div>
							</div>
							<div className="flex flex-col items-center gap-4">
								<TextInput
									size="large"
									name="name"
									hasIconLeft={iconSvg.user}
									placeholder="Full Name"
									value={userAuth.name}
									onChange={inputLogin}
									onKeyDown={handleKeyDown}
									className="w-full"
								/>
								<TextInput
									size="large"
									name="email"
									type="email"
									hasIconLeft={iconSvg.email}
									placeholder="Email Address"
									value={userAuth.email}
									onChange={inputLogin}
									onKeyDown={handleKeyDown}
									className="w-full"
								/>
								<TextInput
									isPasswordField
									size="large"
									name="password"
									hasIconLeft={iconSvg.password}
									placeholder="Password"
									value={userAuth.password}
									onChange={inputLogin}
									onKeyDown={handleKeyDown}
									className="w-full"
								/>
								<div className="w-full flex flex-col gap-2">
									{errorMsg && (
										<p className="text-red-500 text-sm text-center">
											{errorMsg}
										</p>
									)}

									<Button
										isLoading={isLoading}
										disabled={!isFormValid || isLoading}
										size="large"
										className="w-full rounded-full"
										onClick={onAuth}
									>
										Register
									</Button>
								</div>
								<div className="text-sm text-[#333333] text-center w-full">
									Already have an account?{" "}
									<span
										className="text-blue-600 cursor-pointer font-semibold"
										onClick={() => {
											setIsLogin(true);
											setErrorMsg("");
										}}
									>
										Login
									</span>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Login;
