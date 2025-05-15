"use client";

import { motion } from "framer-motion";
import fetchApi from "@/lib/api/fetchApi";
import LineChart from "@/lib/components/Statistic/LineChart";
import BarChart from "@/lib/components/Statistic/BarChart";
import Skeleton from "@/lib/components/Skeleton";
import { iconSvg } from "@/lib/Icons/icon";
import { useEffect, useState } from "react";

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
	const [statistics, setStatistics] = useState({});

	const getStatistics = async () => {
		try {
			const res = await fetchApi.get("/statistics");
			if (res.status === 200) {
				setStatistics(res.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getStatistics();
	}, []);

	return (
		<motion.div
			className="space-y-4 p-6"
			variants={container}
			initial="hidden"
			animate="visible"
		>
			<motion.div className="flex gap-4">
				{Object.entries(statistics).map(([key, value]) => (
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
				<BarChart />
			</motion.div>
		</motion.div>
	);
};

export default Dashboard;
