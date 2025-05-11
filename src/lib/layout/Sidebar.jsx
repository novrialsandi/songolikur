import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { iconSvg } from "../Icons/icon";
import { removeCookie, setCookie } from "../helpers/cookie";
import { useSessionStore, useUsersStore } from "../stores";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import fetchApi from "../api/fetchApi";
import Link from "next/link";

const Sidebar = ({ onMiniSidebar, menus, miniSidebar }) => {
	const pathname = usePathname();
	const { setUsers } = useUsersStore();
	const router = useRouter();
	const { session, setSession } = useSessionStore();
	const [modalProfile, setModalProfile] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [editData, setEditData] = useState({
		name: "",
		bio: "",
	});

	const [modalPassword, setModalPassword] = useState(false);

	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const toggleMiniSidebar = () => {
		onMiniSidebar(!miniSidebar);
	};

	const isMenuActive = (item) => {
		return (
			pathname === item.href || (item.subMenu && pathname === item.subMenu.href)
		);
	};

	const editPassword = async () => {
		try {
			if (
				!passwordData.oldPassword ||
				!passwordData.newPassword ||
				!passwordData.confirmPassword
			) {
				console.error("Please fill in all password fields.");
				return;
			}

			if (passwordData.newPassword.length < 8) {
				console.error("New password must be at least 8 characters.");
				return;
			}

			if (passwordData.newPassword !== passwordData.confirmPassword) {
				console.error("New password and confirmation password do not match.");
				return;
			}

			setEditLoading(true);

			const res = await fetchApi.patch("/auth/password", {
				oldPassword: passwordData.oldPassword,
				newPassword: passwordData.newPassword,
			});

			if (res.status === 200) {
				router.push("/login");
				removeCookie("sid");
				removeCookie("cid");

				setModalProfile(false);
				setModalPassword(false);
				setPasswordData({
					oldPassword: "",
					newPassword: "",
					confirmPassword: "",
				});
			} else {
				console.error("Password update failed with status:", res.status);
			}
		} catch (error) {
			console.error("Error updating password:", error);
		} finally {
			setEditLoading(false);
		}
	};

	const editProfile = async () => {
		try {
			setEditLoading(true);
			const res = await fetchApi.patch("/user/me", {
				name: editData.name || session.name,
				bio: editData.bio || session.bio,
			});
			if (res.status === 200) {
				const updatedUser = res.data.data;
				setCookie("cid", res.data.data);
				setSession(res.data.data);
				if (updatedUser.role === "admin") {
					setUsers((prevUsers) =>
						prevUsers.map((user) =>
							user.user_uuid === updatedUser.user_uuid
								? { ...user, name: updatedUser.name }
								: user
						)
					);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setEditLoading(false);
			setModalProfile(false);
		}
	};

	const uploadAvatar = async (file) => {
		setEditLoading(true);
		const formData = new FormData();
		formData.append("avatar", file);

		try {
			const req = await fetchApi.patch(`/user/upload/avatar`, formData);
			if (req.status === 200) {
				const updatedUser = req.data.user;
				setCookie("cid", req.data.user);
				setSession(req.data.user);
				if (updatedUser.role === "admin") {
					setUsers((prevUsers) =>
						prevUsers.map((user) =>
							user.user_uuid === updatedUser.user_uuid
								? { ...user, avatar: updatedUser.avatar }
								: user
						)
					);
				}
			} else {
				console.error("Upload failed with status:", req.status);
			}
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setEditLoading(false);
		}
	};

	// Handle image selection and upload
	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		input.onchange = () => {
			const file = input.files?.[0];
			if (file) uploadAvatar(file);
		};

		input.click();
	};

	const inputData = (e) => {
		const { name, value } = e.target;
		setEditData((prevAuth) => ({
			...prevAuth,
			[name]: value,
		}));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<>
			<Modal
				preventClose
				visible={modalPassword}
				onClose={() => {
					setModalProfile(false);
					setModalPassword(false);
				}}
				className={"p-6"}
			>
				<div className="space-y-4">
					<>
						<div className="text-2xl font-semibold">Change Password</div>
						<TextInput
							label="Old Password:"
							name="oldPassword"
							type="password"
							placeholder="Enter old password"
							value={passwordData.oldPassword}
							onChange={handlePasswordChange}
							className="w-full"
						/>
						<TextInput
							label="New Password:"
							name="newPassword"
							type="password"
							placeholder="Enter new password"
							value={passwordData.newPassword}
							onChange={handlePasswordChange}
							className="w-full"
						/>
						<TextInput
							label="Renter Password:"
							name="confirmPassword"
							type="password"
							placeholder="Renter new password"
							value={passwordData.confirmPassword}
							onChange={handlePasswordChange}
							className="w-full"
						/>
						<div
							className="text-gray-500 text-sm cursor-pointer"
							onClick={() => {
								setModalPassword(false);
								setModalProfile(true);
							}}
						>
							Back to Profile
						</div>
						<Button
							onClick={editPassword}
							disabled={editLoading}
							isLoading={editLoading}
							className="w-full bg-blue-500 text-white rounded-lg"
						>
							Update Password
						</Button>
					</>
				</div>
			</Modal>

			<Modal
				preventClose
				visible={modalProfile}
				onClose={() => {
					setModalProfile(false);
					setModalPassword(false);
				}}
				className={"p-6"}
			>
				<div className="space-y-4">
					<>
						<div className="text-2xl font-semibold">Edit Profile</div>
						<div className="relative flex flex-col items-center gap-4">
							<img
								src={session?.avatar || "/avatar.png"}
								alt="avatar"
								className="w-24 h-24 rounded-full object-cover transition-opacity duration-300 hover:opacity-70"
							/>
							<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100 pointer-events-none">
								<div
									className="bg-black/60 w-24 h-24 flex cursor-pointer items-center justify-center rounded-full p-2 pointer-events-auto"
									onClick={selectLocalImage}
								>
									{iconSvg.edit}
								</div>
							</div>
						</div>
						<TextInput
							label="Name:"
							name="name"
							placeholder="Full Name"
							value={session.name}
							onChange={inputData}
							className="w-full"
						/>
						<TextInput
							label="Bio:"
							name="bio"
							placeholder="Bio"
							value={session.bio}
							onChange={inputData}
							className="w-full"
						/>
						<TextInput
							isDisabled={true}
							label="Username:"
							name="username"
							placeholder="Username"
							value={session.username}
							className="w-full"
						/>
						<TextInput
							isDisabled={true}
							label="Email:"
							name="email"
							type="email"
							placeholder="Full email"
							value={session.email}
							className="w-full"
						/>

						<div
							className="text-blue-400 text-sm cursor-pointer"
							onClick={() => {
								setModalPassword(true);
								setModalProfile(false);
							}}
						>
							Edit password
						</div>
						<Button
							onClick={editProfile}
							disabled={editLoading}
							isLoading={editLoading}
							className="w-full bg-blue-500 text-white rounded-lg"
						>
							Save Changes
						</Button>
					</>
				</div>
			</Modal>

			<div
				className={`fixed bg-white left-0 top-0 z-[2] flex h-screen max-h-screen flex-col justify-between border-r transition-all duration-300 ${
					miniSidebar ? "w-20" : "w-[271px]"
				}`}
			>
				<div className="flex flex-none flex-col">
					<div
						className={`relative flex flex-none items-center ${
							miniSidebar ? "justify-center py-6" : "justify-between p-6"
						}`}
					>
						<div className="flex items-center gap-2 overflow-hidden">
							<img
								src="/logo.png"
								alt="logo"
								className={` ${
									miniSidebar ? "size-11" : "h-11 w-full"
								}  flex-none`}
							/>
						</div>
						<button
							className={`absolute flex flex-none bg-white items-center justify-center rounded-lg transition-all duration-300 ${
								miniSidebar ? "right-[-12px] rotate-0" : "-right-3 rotate-180"
							}`}
							onClick={toggleMiniSidebar}
						>
							{iconSvg.miniSvg}
						</button>
					</div>

					<div className="mx-2 border-b border-[#4C5563]" />

					<div className="flex-none overflow-hidden overflow-y-auto">
						{Object.entries(menus).map(([category, items]) => (
							<div key={category} className="my-4">
								{!miniSidebar && (
									<h2 className="mb-2 whitespace-nowrap px-6 uppercase text-[#4C5563]">
										{category}
									</h2>
								)}
								<ul>
									{items.map((item, index) => (
										<div key={index} className="relative">
											{isMenuActive(item) && (
												<div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 transform rounded-r-full bg-primary" />
											)}
											<li
												className={`mx-4 mb-2 flex cursor-pointer items-center rounded-lg px-4 py-2 ${
													isMenuActive(item)
														? "border border-[#62666e]"
														: "border border-transparent"
												}`}
											>
												<Link
													href={item.href}
													className="flex w-full items-center"
												>
													<div
														className={`flex items-center ${
															miniSidebar ? "justify-center" : "gap-2"
														}`}
													>
														{item.icon}
														{!miniSidebar && (
															<span className="whitespace-nowrap">
																{item.name}
															</span>
														)}
													</div>
													{!miniSidebar && item.isNotif && (
														<div className="flex h-2 w-2 flex-none rounded-full bg-primary" />
													)}
												</Link>
											</li>
										</div>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="flex-none overflow-hidden">
					<div className="mx-2 border-b border-[#4C5563]" />

					<div
						className={`relative flex items-center ${
							miniSidebar ? "justify-center py-6" : "gap-2 p-6"
						}`}
					>
						<img
							src={session.avatar || "/avatar.png"}
							alt=""
							className="size-11 object-cover cursor-pointer flex-none rounded-full"
							onClick={() => setModalProfile(true)}
						/>
						{!miniSidebar && (
							<div className="flex w-full justify-between">
								<div className="">
									<div className="flex items-center gap-1">
										<div>
											<div className="whitespace-nowrap">{session.name}</div>
											{iconSvg.verifSvg}
										</div>
									</div>
									<div className="whitespace-nowrap text-[13px] text-[#C3C9D1]">
										{session.role}
									</div>
								</div>
								<button
									className="cursor-pointer"
									onClick={() => {
										removeCookie("sid");
										removeCookie("cid");
										setSession({});
										router.push("/login");
									}}
								>
									{iconSvg.logoutSvg}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
