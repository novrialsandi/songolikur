import { iconSvg } from "@/lib/Icons/icon";
import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ data }) => {
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-bold">Total Views</h2>
			</div>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<defs>
						<linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#FE9D73" />
							<stop offset="100%" stopColor="#EC290A" />
						</linearGradient>
					</defs>
					<XAxis dataKey="name" tickLine={false} />
					<YAxis axisLine={true} dataKey="totalViews" />
					<Tooltip
						cursor={false}
						contentStyle={{
							border: "none",
							borderRadius: "8px",
						}}
						itemStyle={{ color: "#000000" }}
					/>
					<Bar
						dataKey="totalViews"
						fill="url(#barGradient)"
						barSize={44}
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</>
	);
};

export default BarChartComponent;
