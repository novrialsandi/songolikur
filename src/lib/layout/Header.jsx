import { useState } from "react";
import Button from "../components/Button";
import { useRouter, useParams, usePathname } from "next/navigation";
import fetchApi from "../api/fetchApi";
import { useSessionStore, useUsersStore } from "../stores";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";

const Header = ({ sidebarWidth, pageTitle }) => {
	const { setUsers } = useUsersStore();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [createModal, setCreateModal] = useState(false);
	const { session } = useSessionStore();
	const [errorMsg, setErrorMsg] = useState("");
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		username: "",
		password: "",
	});

	const isFormValid =
		userData.name.trim() !== "" &&
		userData.email.trim() !== "" &&
		userData.username.trim() !== "" &&
		userData.password.trim() !== "";

	const createCollection = async () => {
		try {
			setLoading(true);
			const req = await fetchApi.post("/collection", {
				title: "New Project",
				content: "",
			});

			if (req.status === 201) {
				router.push(`/dashboard/collection/${req.data.collection_uuid}`);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const createUser = async () => {
		try {
			setLoading(true);
			const req = await fetchApi.post("/auth/register", {
				name: userData.name,
				email: userData.email,
				username: userData.username,
				password: userData.password,
			});

			if (req.status === 201) {
				setUsers((prevUsers) => {
					const updatedUsers = [...prevUsers, req.data.user];

					updatedUsers.sort((a, b) => {
						if (a.role === b.role) {
							return a.name.localeCompare(b.name);
						}
						return a.role.localeCompare(b.role);
					});

					return updatedUsers;
				});
			}
		} catch (error) {
			setErrorMsg(error.response.data.message);
			console.log(error);
		} finally {
			setLoading(false);
			setCreateModal(false);
			setUserData({
				name: "",
				email: "",
				username: "",
				password: "",
			});
		}
	};

	const inputLogin = (e) => {
		const { name, value } = e.target;
		setUserData((prevAuth) => ({
			...prevAuth,
			[name]: value,
		}));
	};

	return (
		<>
			<Modal
				preventClose
				visible={createModal}
				onClose={() => {
					setCreateModal(false);
					// setSelectedUser(null);
				}}
				className={"p-6"}
			>
				<div className="space-y-4">
					<div className="text-2xl font-semibold">Create User</div>
					<div className="flex flex-col items-center gap-4">
						<TextInput
							name="name"
							placeholder="Full Name"
							value={userData.name}
							onChange={inputLogin}
							className="w-full"
						/>
						<TextInput
							name="username"
							placeholder="Username"
							value={userData.username}
							onChange={inputLogin}
							className="w-full"
						/>
						<TextInput
							name="email"
							type="email"
							placeholder="Email Address"
							value={userData.email}
							onChange={inputLogin}
							className="w-full"
						/>
						<TextInput
							isPasswordField
							name="password"
							placeholder="Password"
							value={userData.password}
							onChange={inputLogin}
							className="w-full"
						/>
						<div className="w-full flex flex-col gap-2">
							{errorMsg && (
								<p className="text-red-500 text-sm text-center">{errorMsg}</p>
							)}

							<Button
								isLoading={loading}
								disabled={!isFormValid || loading}
								className="w-full rounded-md"
								onClick={createUser}
							>
								Register
							</Button>
						</div>
					</div>
				</div>
			</Modal>

			<div
				className={`fixed top-0 z-[1] ${sidebarWidth} bg-white right-0 flex flex-col justify-between border-b p-6 transition-all duration-300`}
			>
				<div className="flex h-11 items-center justify-between gap-4">
					<div className="text-2xl font-bold">{pageTitle}</div>
					{!params.uuid && pathname.includes("collection") && (
						<Button
							className="p-3 h-full rounded-md w-40"
							onClick={createCollection}
							disabled={loading}
							isLoading={loading}
						>
							Create Collection
						</Button>
					)}
					{pathname === "/dashboard/user" && session.role === "admin" && (
						<Button
							className="p-3 h-full rounded-md w-40"
							onClick={() => setCreateModal(true)}
						>
							Create User
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;
