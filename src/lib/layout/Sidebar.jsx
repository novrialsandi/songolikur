import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { iconSvg } from "../Icons/icon";

const Sidebar = ({ onMiniSidebar, menus, miniSidebar }) => {
	const pathname = usePathname();
	const router = useRouter();

	const handleMenu = (category, index) => {
		router.push(menus[category][index].href);
	};

	const toggleMiniSidebar = () => {
		onMiniSidebar(!miniSidebar);
	};

	const isMenuActive = (item) => {
		return (
			pathname === item.href || (item.subMenu && pathname === item.subMenu.href)
		);
	};

	return (
		<div
			className={`fixed left-0 top-0 z-[2] flex h-screen max-h-screen flex-col justify-between border-r transition-all duration-300 ${
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
							src="/rent-car.png"
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
											onClick={() => handleMenu(category, index)}
											className={`mx-4 mb-2 flex cursor-pointer items-center rounded-lg px-4 py-2  ${
												isMenuActive(item) ? "bg-[#62666e]" : ""
											}`}
										>
											<div
												className={`flex w-full items-center ${
													miniSidebar ? "justify-center" : "justify-between"
												}`}
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
											</div>
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
					<img src="/avatar.png" alt="" className="size-11 flex-none" />
					{!miniSidebar && (
						<div className="flex w-full justify-between">
							<div className="">
								<div className="flex items-center gap-1">
									<div>
										<div className="whitespace-nowrap">name</div>
										{iconSvg.verifSvg}
									</div>
								</div>
								<div className="whitespace-nowrap text-[13px] text-[#C3C9D1]">
									admin
								</div>
							</div>
							<button>{iconSvg.logoutSvg}</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
