"use client";

import fetchApi from "@/lib/api/fetchApi";
import TextInput from "@/lib/components/TextInput";
import { iconSvg } from "@/lib/Icons/icon";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";

const Home = () => {
	const dropdownItem = [
		{ id: 1, label: "Pending", value: "pending" },
		{ id: 2, label: "Success", value: "success" },
		{ id: 3, label: "Cancelled", value: "cancelled" },
	];

	const [transaction, setTransaction] = useState([]);
	const [isLoading, setIsloading] = useState(true);
	const [addLoading, setAddloading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [editData, setEditData] = useState(null);
	const [editLoading, setEditLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
	const [pendingDeleteUUIDs, setPendingDeleteUUIDs] = useState([]);

	const [addData, setAddData] = useState({
		item: "",
		price: "",
		status: "pending",
		note: "",
	});

	const [selectedData, setSelectedData] = useState([]);
	const [isMobile, setIsMobile] = useState(false);

	// Check screen size
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Set initial value
		checkScreenSize();

		// Add event listener
		window.addEventListener("resize", checkScreenSize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", checkScreenSize);
		};
	}, []);

	const getTransaction = async () => {
		setIsloading(true);

		try {
			const req = await fetchApi.get("/transaction");
			if (req.status === 200) {
				setTransaction(req.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsloading(false);
		}
	};

	useEffect(() => {
		getTransaction();
	}, []);

	const addTrasaction = async () => {
		setAddloading(true);
		try {
			const req = await fetchApi.post("/transaction", addData);

			if (req.status === 201) {
				setTransaction((prev) => [...prev, req.data.transaction]);
				setAddData({ item: "", price: 0, status: "pending", note: "" });
			}
		} catch (error) {
			console.log(error);
		} finally {
			setOpenModal(false);
			setAddloading(false);
		}
	};

	const updateTransaction = async () => {
		if (!editData) return;

		setEditLoading(true);
		try {
			const req = await fetchApi.patch(
				`/transaction/${editData.uuid}`,
				editData
			);

			if (req.status === 200) {
				setTransaction((prev) =>
					prev.map((tx) =>
						tx.uuid === editData.uuid ? req.data.transaction : tx
					)
				);
				setEditData(null);
				setOpenModal(false);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setEditLoading(false);
		}
	};

	const inputData = (e) => {
		const { name, value } = e.target;

		setAddData((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;

		setEditData((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	const onEdit = (data) => {
		setEditData(data);
		setOpenModal(true);
	};

	const onDelete = async (uuids) => {
		setAddloading(true);
		try {
			if (Array.isArray(uuids)) {
				await Promise.all(
					uuids.map((uuid) => fetchApi.delete(`/transaction/${uuid}`))
				);
				setTransaction((prev) => prev.filter((tx) => !uuids.includes(tx.uuid)));
			} else {
				const req = await fetchApi.delete(`/transaction/${uuids}`);
				if (req.status === 200) {
					setTransaction((prev) => prev.filter((tx) => tx.uuid !== uuids));
				}
			}
			setSelectedData([]);
		} catch (error) {
			console.log(error);
		} finally {
			setAddloading(false);
		}
	};

	const handleDeleteClick = (uuidOrArray) => {
		setPendingDeleteUUIDs(
			Array.isArray(uuidOrArray) ? uuidOrArray : [uuidOrArray]
		);
		setShowConfirmDeleteModal(true);
	};

	const confirmDelete = () => {
		onDelete(pendingDeleteUUIDs);
		setShowConfirmDeleteModal(false);
		setPendingDeleteUUIDs([]);
	};

	const isFormValid = editData
		? editData.item.trim() !== "" && editData.price !== 0
		: addData.item.trim() !== "" && addData.price !== 0;

	const filteredTransactions = transaction.filter((tx) =>
		tx.item.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusStyles = (status) => {
		if (status === "success") return "bg-green-100 text-green-700";
		if (status === "cancelled" || status === "canceled")
			return "bg-red-100 text-red-700";
		return "bg-gray-200 text-gray-800"; // pending
	};

	return (
		<>
			<Modal
				visible={openModal}
				onClose={() => {
					setOpenModal(false);
					setEditData(null);
				}}
			>
				<div className="p-4 md:p-8 space-y-6 w-full max-w-md mx-auto animate-fade-in">
					<h2 className="text-xl font-semibold text-center">
						{editData ? "Edit Transaction" : "Add New Transaction"}
					</h2>

					<div className="space-y-4">
						<div>
							<label className="text-sm text-gray-600">Item Name</label>
							<TextInput
								size="large"
								name="item"
								placeholder="e.g. Coffee"
								value={editData ? editData.item : addData.item}
								onChange={editData ? handleEditChange : inputData}
								className="mt-1"
							/>
						</div>

						<div>
							<label className="text-sm text-gray-600">Price ($)</label>
							<TextInput
								size="large"
								name="price"
								type="number"
								placeholder="e.g. 15000"
								value={editData ? editData.price : addData.price}
								onChange={editData ? handleEditChange : inputData}
								className="mt-1"
							/>
						</div>

						{editData && (
							<Dropdown
								items={dropdownItem}
								popupTopPosition={50}
								maxWidth="400px"
								popupPosition="right"
								defaultValue={editData.status}
								onStateChange={(e) => {
									setEditData((prev) => ({
										...prev,
										status: e,
									}));
								}}
							/>
						)}

						<div>
							<label className="text-sm text-gray-600">Note</label>
							<TextArea
								name="note"
								placeholder="Add a note (optional)"
								value={editData ? editData.note : addData.note}
								onChange={editData ? handleEditChange : inputData}
								className="mt-1"
							/>
						</div>
					</div>

					<Button
						className="w-full rounded-xl font-semibold text-white h-11 bg-blue-600 hover:bg-blue-700 transition"
						onClick={editData ? updateTransaction : addTrasaction}
						disabled={addLoading || editLoading || !isFormValid}
						isLoading={addLoading || editLoading}
					>
						{editData ? "Update" : "Submit"}
					</Button>
				</div>
			</Modal>

			<Modal
				visible={showConfirmDeleteModal}
				onClose={() => setShowConfirmDeleteModal(false)}
			>
				<div className="p-6 w-full max-w-sm mx-auto text-center space-y-6 animate-fade-in">
					<h2 className="text-lg font-semibold">Delete Confirmation</h2>
					<p className="text-sm text-gray-600">
						Are you sure you want to delete {pendingDeleteUUIDs.length}{" "}
						transaction(s)?
					</p>
					<div className="flex gap-4 justify-center mt-6">
						<Button
							className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
							onClick={() => setShowConfirmDeleteModal(false)}
						>
							Cancel
						</Button>
						<Button
							className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
							onClick={confirmDelete}
							isLoading={addLoading}
						>
							Yes, Delete
						</Button>
					</div>
				</div>
			</Modal>

			<div className="flex w-full h-full justify-center py-4 md:py-20 px-2 md:p-4">
				<div className="bg-white border border-black/10 rounded-sm w-full max-w-7xl">
					<div className="p-2 md:p-0">
						<TextInput
							className="border-0 h-12"
							placeholder="Search Transaction"
							hasIconRight={iconSvg.search}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Selection header - visible when items are selected */}
					{selectedData.length > 0 && (
						<div className="flex justify-between items-center bg-blue-50 px-4 py-2 border-b border-black/10">
							<div className="text-sm">
								<span className="font-medium">{selectedData.length}</span> items
								selected
							</div>
							<Button
								className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md"
								onClick={() => handleDeleteClick(selectedData)}
							>
								Delete Selected
							</Button>
						</div>
					)}

					{/* Table view for desktop */}
					{!isMobile && (
						<div className="max-h-[635px] overflow-y-auto">
							<table className="w-full text-sm text-left border-y border-gray-200">
								<thead className="bg-gray-100">
									<tr className="h-12 border-b border-black/10">
										<th className="px-4 py-2">
											<div
												className="cursor-pointer"
												onClick={() => {
													if (selectedData.length === transaction.length) {
														setSelectedData([]);
													} else {
														setSelectedData(transaction.map((tx) => tx.uuid));
													}
												}}
											>
												{selectedData.length === transaction.length
													? iconSvg.checkBox
													: iconSvg.box}
											</div>
										</th>
										<th className="px-4 py-2">Item</th>
										<th className="px-4 py-2">Price</th>
										<th className="px-4 py-2">Date</th>
										<th className="px-4 py-2">Status</th>
										<th className="px-4 py-2 text-end">Action</th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<tr>
											<td colSpan={6}>
												<div className="flex justify-center items-center h-12">
													<div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
												</div>
											</td>
										</tr>
									) : filteredTransactions.length > 0 ? (
										filteredTransactions.map((tx, index) => (
											<tr key={index} className="border-b border-black/10 h-12">
												<td className="px-4 py-2">
													<div
														className="cursor-pointer"
														onClick={() => {
															setSelectedData((prev) =>
																prev.includes(tx.uuid)
																	? prev.filter((id) => id !== tx.uuid)
																	: [...prev, tx.uuid]
															);
														}}
													>
														{selectedData.includes(tx.uuid)
															? iconSvg.checkBox
															: iconSvg.box}
													</div>
												</td>
												<td className="px-4 py-2">{tx.item}</td>
												<td className="px-4 py-2">$ {tx.price}</td>
												<td className="px-4 py-2">
													{new Date(tx.createdAt).toLocaleDateString("id-ID")}
												</td>
												<td className="px-4 py-2">
													<span
														className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
															tx.status
														)}`}
													>
														{tx.status}
													</span>
												</td>
												<td className="px-4">
													<div className="flex gap-4 justify-end">
														<div
															className={`hover:bg-[#e6e6e6] rounded-full p-1 ${
																selectedData.length > 0
																	? "bg-gray-400 cursor-not-allowed"
																	: "cursor-pointer"
															}`}
															onClick={() => {
																if (selectedData.length === 0) {
																	onEdit(tx);
																}
															}}
														>
															{iconSvg.edit}
														</div>
														<div
															className="hover:bg-red-400 rounded-full p-1 cursor-pointer"
															onClick={() => handleDeleteClick(tx.uuid)}
														>
															{iconSvg.delete}
														</div>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={6}>
												<div className="h-12 flex items-center justify-center text-gray-500">
													No transactions found
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}

					{/* Card view for mobile */}
					{isMobile && (
						<div className="max-h-[calc(100vh-200px)] overflow-y-auto px-2 py-2">
							{isLoading ? (
								<div className="flex justify-center items-center h-20">
									<div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
								</div>
							) : filteredTransactions.length > 0 ? (
								<div className="space-y-3">
									{filteredTransactions.map((tx, index) => (
										<div
											key={index}
											className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
										>
											<div className="flex justify-between items-start mb-3">
												<div className="flex-1">
													<h3 className="font-medium text-gray-900">
														{tx.item}
													</h3>
													<p className="text-lg font-semibold text-gray-900">
														$ {tx.price}
													</p>
												</div>
												<div
													className="cursor-pointer"
													onClick={() => {
														setSelectedData((prev) =>
															prev.includes(tx.uuid)
																? prev.filter((id) => id !== tx.uuid)
																: [...prev, tx.uuid]
														);
													}}
												>
													{selectedData.includes(tx.uuid)
														? iconSvg.checkBox
														: iconSvg.box}
												</div>
											</div>

											<div className="flex justify-between items-center">
												<div>
													<p className="text-xs text-gray-500">
														{new Date(tx.createdAt).toLocaleDateString("id-ID")}
													</p>
													<span
														className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusStyles(
															tx.status
														)}`}
													>
														{tx.status}
													</span>
												</div>

												<div className="flex gap-2">
													<button
														className={`p-2 rounded-full ${
															selectedData.length > 0 &&
															selectedData.length !== 1
																? "bg-gray-200 text-gray-400"
																: "bg-gray-100 text-gray-600 active:bg-gray-200"
														}`}
														onClick={() => {
															if (
																selectedData.length === 0 ||
																(selectedData.length === 1 &&
																	selectedData[0] === tx.uuid)
															) {
																onEdit(tx);
															}
														}}
														disabled={
															selectedData.length > 0 &&
															selectedData.length !== 1
														}
													>
														{iconSvg.edit}
													</button>
													<button
														className="p-2 bg-red-50 text-red-500 rounded-full active:bg-red-100"
														onClick={() => handleDeleteClick(tx.uuid)}
													>
														{iconSvg.delete}
													</button>
												</div>
											</div>

											{tx.note && (
												<div className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-600">
													<p>{tx.note}</p>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="flex justify-center items-center h-24 text-gray-500">
									No transactions found
								</div>
							)}
						</div>
					)}

					<div
						className="p-4 w-full flex justify-center hover:bg-black/10 cursor-pointer"
						onClick={() => setOpenModal(true)}
					>
						<div className="flex items-center gap-2">
							{iconSvg.plus}
							<span className="text-sm font-medium">Add Transaction</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
