"use client";

import { motion } from "framer-motion";
import fetchApi from "@/lib/api/fetchApi";
import LineChart from "@/lib/components/Chart/LineChart";
import BarChart from "@/lib/components/Chart/BarChart";
import Skeleton from "@/lib/components/Skeleton";
import { iconSvg } from "@/lib/Icons/icon";
import { useEffect, useState } from "react";
import moment from "moment";

const container = {
	hidden: { opacity: 1, scale: 0 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			delayChildren: 0.3,
			staggerChildren: 0.2,
		},
	},
};

const item = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
	},
};

const Dashboard = () => {
	const [engagements, setEngagement] = useState({});
	const [monthlyEngagements, setMonthlyEngagements] = useState([]);

	const getEngagements = async (
		startDate = "",
		endDate = "",
		userFilter = ""
	) => {
		try {
			const params = {};
			if (startDate) params.startDate = startDate;
			if (endDate) params.endDate = endDate;
			if (userFilter) params.userFilter = userFilter;

			// Jalankan kedua request secara paralel
			const [res, resMonthly] = await Promise.all([
				fetchApi.get("/engagement", { params }),
				fetchApi.get("/engagement/monthly", { params }),
			]);

			if (res.status === 200) {
				setEngagement(res.data);
			}

			if (resMonthly.status === 200) {
				setMonthlyEngagements(
					resMonthly.data.views.map((item) => ({
						...item,
						name: moment(item.month).format("MMM YYYY"),
					}))
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getEngagements();
	}, []);

	return (
		<motion.div
			className="space-y-4 p-6"
			variants={container}
			initial="hidden"
			animate="visible"
		>
			<motion.div className="flex gap-4">
				{Object.entries(engagements).map(([key, value]) => (
					<motion.div key={key} className="w-full" variants={item}>
						<LineChart
							title={key
								.replace(/([A-Z])/g, " $1")
								.replace(/^./, (str) => str.toUpperCase())}
							value={value}
						/>
					</motion.div>
				))}
			</motion.div>
			<motion.div
				className="flex flex-col justify-between rounded-lg border border-[#cccccc] p-4"
				variants={item}
			>
				<BarChart data={monthlyEngagements} />
			</motion.div>
		</motion.div>
	);
};

export default Dashboard;
