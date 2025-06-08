"use client";

import Button from "@/lib/components/Button";
import TextInput from "@/lib/components/TextInput";
import { useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/stores";
import { setCookie, getCookie } from "@/lib/helpers/cookie";
import fetchApi from "@/lib/api/fetchApi";
import { toast } from "react-toastify";
import Divider from "@/lib/components/Divider";
import GoogleLoginPopup from "./GoogleLoginPopup";

const Login = () => {
	const { setSession } = useSessionStore();
	const router = useRouter();
	// const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [userAuth, setUserAuth] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [errorMsg, setErrorMsg] = useState("");

	const isFormValid =
		userAuth.email.trim() !== "" && userAuth.password.trim() !== "";

	const onAuth = async () => {
		setIsLoading(true);
		try {
			const req = await fetchApi.post("/auth/login", {
				email: userAuth.email,
				password: userAuth.password,
			});

			if (req.status === 200) {
				setCookie("sid", req.data.token, "nextMonday");
				setCookie("cid", req.data.user, "nextMonday");
				setSession(getCookie("cid"));
				setErrorMsg("");

				const destination = ["admin", "editor", "contributor"].includes(
					req.data.user.role
				)
					? "/dashboard"
					: "/";

				setTimeout(() => {
					window.location.href = destination; // Redirect setelah login sukses
				}, 200);
				toast.success("Login successfully");
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
			onAuth();
		}
	};

	const handleGoogleSuccess = (data) => {
		setCookie("sid", data.token, "nextMonday");
		setCookie("cid", data.user, "nextMonday");
		setSession(getCookie("cid"));

		const destination = ["admin", "editor", "contributor"].includes(
			data.user.role
		)
			? "/dashboard"
			: "/";

		setTimeout(() => {
			window.location.href = destination; // Redirect setelah login sukses
		}, 200);
	};

	const handleGoogleError = (error) => {
		console.error("Google login error:", error);
		// Handle error cases
		switch (error) {
			case "no_email":
				alert("No email found in Google account");
				break;
			case "inactive_account":
				alert("Your account is inactive");
				break;
			case "server_error":
				alert("Server error occurred");
				break;
			default:
				alert("Login failed");
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center lg:max-h-screen">
			<div className="flex w-full lg:w-1/2 justify-center px-4 py-8 lg:px-0 lg:py-0">
				<div className="w-full max-w-[455px] gap-6 flex flex-col items-center">
					<div className="hidden lg:flex w-1/2 pb-4 justify-center">
						<Divider />
					</div>

					{/* Header Text */}
					<div className="text-center space-y-3">
						<div className="font-bold text-center text-2xl sm:text-3xl lg:text-4xl">
							Login to Account
						</div>
						<div className="text-sm sm:text-base text-center text-[#62626D] px-4 lg:px-0">
							Please log in to access the Songolikur Dashboard.
						</div>
					</div>

					{/* Form Section */}
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

						{/* Buttons Section */}
						<div className="w-full flex flex-col gap-2">
							{errorMsg && (
								<p className="text-red-500 text-sm text-center px-2">
									{errorMsg}
								</p>
							)}

							<Button
								isLoading={isLoading}
								disabled={!isFormValid || isLoading}
								className="w-full rounded-md py-3 sm:py-2"
								onClick={onAuth}
							>
								Login
							</Button>
						</div>
					</div>
					<Divider text="OR" />

					<GoogleLoginPopup
						onSuccess={handleGoogleSuccess}
						onError={handleGoogleError}
					/>

					<div className="hidden lg:flex w-1/2 pt-4 justify-center">
						<Divider />
					</div>
				</div>
			</div>

			<img
				src="/login.webp"
				className="hidden lg:block lg:w-1/2 h-screen object-cover"
				alt="Login illustration"
			/>
		</div>
	);
};

export default Login;
