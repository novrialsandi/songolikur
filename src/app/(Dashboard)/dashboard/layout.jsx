import React from "react";
import Navbar from "@/lib/layout/Index";

const DashboardLayout = ({ children }) => {
	return (
		<>
			<Navbar>{children}</Navbar>
		</>
	);
};

export default DashboardLayout;
