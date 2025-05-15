import React from "react";
import { iconSvg } from "@/lib/Icons/icon";
import { AreaChart, ResponsiveContainer, Tooltip, Area } from "recharts";

const LineChart = ({
	// data = [
	// 	{ name: "Jan", value: 1000 },
	// 	{ name: "Feb", value: 1200 },
	// 	{ name: "Mar", value: 1100 },
	// 	{ name: "Apr", value: 1300 },
	// 	{ name: "May", value: 1200 },
	// 	{ name: "Jun", value: 1400 },
	// 	{ name: "Jul", value: 1800 },
	// 	{ name: "Aug", value: 2000 },
	// 	{ name: "Sep", value: 2200 },
	// 	{ name: "Oct", value: 2400 },
	// ],
	title,
	value,
	hasIcon,
}) => {
	return (
		<div className="flex h-28 flex-col justify-between rounded-lg border border-[#cccccc] p-4">
			<div className="flex flex-col items-center justify-between h-full text-center">
				<div className="font-bold">{title}</div>
				<div className="text-4xl">{value}</div>
			</div>
			{/* <div className="flex items-end justify-between gap-8">
				<div className="flex flex-col gap-2">
					<div className="">{value}</div>
					<div className="text-[#16B364]">
						<div className="flex">
							<span className="flex items-center gap-1 rounded-xl border border-[#16B364] px-1">
								{iconSvg.upSvg} 7.2%
							</span>
						</div>
					</div>
				</div>
				<div className="h-12 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
							<defs>
								<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#16B364" stopOpacity={0.5} />
									<stop offset="95%" stopColor="#16B364" stopOpacity={0} />
								</linearGradient>
							</defs>

							<Tooltip
								contentStyle={{
									background: "#2B2F38",
									border: "none",
									borderRadius: "8px",
								}}
								itemStyle={{ color: "#fff" }}
								formatter={(value) => [`${value} Transaksi`, ""]}
								labelFormatter={() => ""}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke="#16B364"
								fillOpacity={1}
								fill="url(#colorValue)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div> */}
		</div>
	);
};

export default LineChart;
