"use client";

import fetchApi from "@/lib/api/fetchApi";
import React, { useEffect, useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";
import Modal from "@/lib/components/Modal";
import Dropdown from "@/lib/components/Dropdown";
import Button from "@/lib/components/Button";
import ToggleButton from "@/lib/components/Toogle";
import { useUsersStore } from "@/lib/stores";
import { toast } from "react-toastify";

const attributes = [
	"",
	"name",
	"username",
	"email",
	"role",
	// "Draft",
	// "On Review",
	// "Published",
	// "Total Collections",
	// "Average Views",
	"Active",
	" ",
];

const Index = () => {
	const { users, setUsers } = useUsersStore();
	const [loading, setLoading] = useState(true);
	const [editLoading, setEditLoading] = useState(false);
	const [modalEdit, setModalEdit] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const dropDownItems = [
		{ label: "Admin", value: "admin" },
		{ label: "Contributor", value: "contributor" },
		{ label: "Editor", value: "editor" },
		{ label: "User", value: "user" },
	];

	const getUsers = async () => {
		try {
			const res = await fetchApi.get("/user");
			if (res.status === 200) {
				setUsers(res.data.users);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		try {
			setEditLoading(true);
			const res = await fetchApi.patch(
				`/user/${selectedUser.user_uuid}`,
				selectedUser
			);
			if (res.status === 200) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.user_uuid === selectedUser.user_uuid
							? { ...user, ...selectedUser }
							: user
					)
				);
				toast.success("User updated successfully");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to update user. Please try again.");
		} finally {
			setEditLoading(false);
			setModalEdit(false);
			setSelectedUser(null);
		}
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<>
			<Modal
				preventClose
				visible={modalEdit}
				onClose={() => {
					setModalEdit(false);
					setSelectedUser(null);
				}}
				className={"p-6"}
			>
				<div className="space-y-4">
					<div className="text-2xl font-semibold">Edit User</div>
					<div className="flex flex-col items-center gap-4">
						<img
							src={selectedUser?.avatar || "/avatar.png"}
							alt="avatar"
							className="w-24 h-24 rounded-full object-cover"
						/>
						<div className="text-xl ">{selectedUser?.name}</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Role:</label>
						<Dropdown
							items={dropDownItems}
							defaultValue={selectedUser?.role}
							onStateChange={(e) =>
								setSelectedUser((prev) => ({ ...prev, role: e }))
							}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Active:</label>
						<ToggleButton
							isActive={selectedUser?.isActive}
							onChange={(isActive) =>
								setSelectedUser((prev) => ({ ...prev, isActive }))
							}
						/>
					</div>

					<Button
						onClick={handleSave}
						disabled={editLoading}
						isLoading={editLoading}
						className="w-full bg-blue-500 text-white rounded-lg "
					>
						Save Changes
					</Button>
				</div>
			</Modal>

			<div className="p-6 mx-auto">
				<table className="w-full border-collapse border border-[#cccccc]">
					<thead>
						<tr className="bg-gray-200">
							{attributes.map((attr) => (
								<th
									key={attr}
									className={`text-left p-2 border border-[#cccccc] capitalize ${
										attr === "" ? "w-[49px]" : attr === " " ? "w-[41px]" : ""
									}`}
								>
									{attr}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={attributes.length}
									className="text-center p-4 border border-[#cccccc]"
								>
									Loading...
								</td>
							</tr>
						) : users.length > 0 ? (
							users.map((user, index) => (
								<tr key={index} className="bg-white hover:bg-gray-100">
									{attributes.map((attr) => (
										<td
											key={attr}
											className={`p-2 border  border-[#cccccc] ${
												attr === ""
													? "w-[49px]"
													: attr === " "
													? " w-[41px]"
													: ""
											}`}
										>
											{attr === "" ? (
												<img
													src={user.avatar || "/avatar.png"}
													alt="avatar"
													className="size-8 object-cover rounded-full"
												/>
											) : attr === " " ? (
												<button
													className="cursor-pointer"
													onClick={() => {
														setSelectedUser(user);
														setModalEdit(true);
													}}
												>
													{iconSvg.menuSvg}
												</button>
											) : // ) : attr === "Draft" ? (
											// 	<>{user.engagement.draftCount}</>
											// ) : attr === "Published" ? (
											// 	<>{user.engagement.publishedCount}</>
											// ) : attr === "On Review" ? (
											// 	<>{user.engagement.reviewCount}</>
											// ) : attr === "Total Collections" ? (
											// 	<>{user.engagement.totalCollections}</>
											// ) : attr === "Average Views" ? (
											// 	<>{user.engagement.engagements.averageViews}</>
											attr === "Active" ? (
												<>
													{user.isActive ? iconSvg.checkSvg : iconSvg.crossSvg}
												</>
											) : (
												String(user[attr.toLowerCase()] || "N/A")
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={attributes.length}
									className="text-center p-4 border border-[#cccccc]"
								>
									No users found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Index;
