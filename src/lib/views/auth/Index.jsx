"use client";

import Button from "@/lib/components/Button";
import TextInput from "@/lib/components/TextInput";
import { useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/stores";
import { motion, AnimatePresence } from "framer-motion";
import { setCookie, getCookie } from "@/lib/helpers/cookie";
import fetchApi from "@/lib/api/fetchApi";
import { toast } from "react-toastify";
import Divider from "@/lib/components/Divider";

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
					setCookie("sid", req.data.token, "nextMonday");
					setCookie("cid", req.data.user, "nextMonday");
					setSession(getCookie("cid"));
					setErrorMsg("");

					if (req.data.user.role === "user") {
						router.push("/");
					} else {
						router.push("/dashboard");
					}

					toast.success("Login successfully");
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

			console.error(error);
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
		<div className="flex max-h-screen w-full items-center justify-center">
			<div className="flex w-1/2 justify-center">
				<div
					key="login"
					variants={formVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.4 }}
					className="w-full max-w-[455px] gap-6  flex flex-col items-center"
				>
					<div className="w-1/2 pb-4 flex justify-center">
						<Divider />
					</div>
					<div className="text-center space-y-3 pb-4">
						<div className="font-bold text-center text-4xl">
							Login to Acount
						</div>
						<div className="text-base text-center text-[#62626D]">
							Please log in to access the Songolikur Dashboard.
						</div>
					</div>
					<div className="flex flex-col w-full items-center gap-4">
						<TextInput
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
							name="password"
							type="password"
							hasIconLeft={iconSvg.password}
							placeholder="Password"
							value={userAuth.password}
							onChange={inputLogin}
							onKeyDown={handleKeyDown}
							className="w-full"
						/>
						<div className="w-full flex flex-col gap-2 pt-6">
							{errorMsg && (
								<p className="text-red-500 text-sm text-center">{errorMsg}</p>
							)}

							<Button
								isLoading={isLoading}
								disabled={!isFormValid || isLoading}
								className="w-full rounded-md"
								onClick={onAuth}
							>
								Login
							</Button>
						</div>
					</div>
					<div className="w-1/2 pt-4 flex justify-center">
						<Divider />
					</div>{" "}
				</div>
			</div>
			<img src="/login.webp" className="w-1/2 h-screen" alt="" />
		</div>
	);
};

export default Login;
