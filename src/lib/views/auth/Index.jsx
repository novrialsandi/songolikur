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
					setSession(req.data.user);
					setCookie("sid", req.data.token, "nextMonday");
					setCookie("cid", req.data.user, "nextMonday");
					setErrorMsg("");

					if (req.data.user.role === "user") {
						router.push("/");
					} else {
						router.push("/dashboard");
					}
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
				// 	router.push("/");
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
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="flex w-[455px] flex-col justify-around rounded-xl border px-8 py-10">
				{/* <div className="flex w-full flex-col items-center gap-4">
					<img
						src="/rent-car.png"
						alt=""
						className="aspect-square size-[60px]"
					/>

				
				</div> */}

				<AnimatePresence mode="wait">
					{isLogin ? (
						<motion.div
							key="login"
							variants={formVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.4 }}
							className="w-full gap-6 md:gap-8 flex flex-col justify-between"
						>
							<div className="text-center md:text-left">
								<div className="font-bold text-center text-2xl md:text-[26px]">
									Hello Again!
								</div>
								<div className="text-base text-center md:text-lg">
									Welcome Back
								</div>
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
								{/* <div className="text-sm text-[#333333] text-center w-full">
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
								</div> */}
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
							className="w-full gap-6 md:gap-8 flex flex-col justify-between"
						>
							<div className="text-center md:text-left">
								<div className="font-bold text-center text-2xl md:text-[26px]">
									Join Us!
								</div>
								<div className="text-base text-center md:text-lg">
									Create your account
								</div>
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
								{/* <div className="text-sm text-[#333333] text-center w-full">
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
								</div> */}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Login;
