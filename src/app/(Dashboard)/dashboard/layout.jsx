import React from "react";
import Layout from "@/lib/layout/Index";

const DashboardLayout = ({ children }) => {
	return (
		<>
			<Layout>{children}</Layout>
		</>
	);
};

export default DashboardLayout;
