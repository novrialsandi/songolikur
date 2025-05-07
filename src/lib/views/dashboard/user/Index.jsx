"use client";

import fetchApi from "@/lib/api/fetchApi";
import React, { useEffect, useState } from "react";
import { iconSvg } from "@/lib/Icons/icon";

const attributes = ["", "name", "username", "email", "role", "Active", " "];

const Index = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const getUsers = async () => {
		try {
			const res = await fetchApi.get("/user");
			if (res.status === 200) {
				setUsers(res.data.user);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<div className="p-6 mx-auto">
			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr className="bg-gray-100">
						{attributes.map((attr) => (
							<th
								key={attr}
								className={`text-left p-2 border border-gray-300 capitalize ${
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
								className="text-center p-4 border border-gray-300"
							>
								Loading...
							</td>
						</tr>
					) : users.length > 0 ? (
						users.map((user, index) => (
							<tr key={index} className="odd:bg-white even:bg-gray-50">
								{attributes.map((attr) => (
									<td
										key={attr}
										className={`p-2 border  border-gray-300 ${
											attr === "" ? "w-[49px]" : attr === " " ? " w-[41px]" : ""
										}`}
									>
										{attr === "" ? (
											<img
												src={user.avatar}
												alt="avatar"
												className="size-8 rounded-full"
											/>
										) : attr === " " ? (
											<>{iconSvg.menuSvg} </>
										) : attr === "Active" ? (
											String(user.isActive || "N/A")
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
								className="text-center p-4 border border-gray-300"
							>
								No users found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Index;
