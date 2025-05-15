import { iconSvg } from '@/lib/Icons/icon';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{ name: 'Jan', 2024: 700 },
	{ name: 'Feb', 2024: 900 },
	{ name: 'Mar', 2024: 500 },
	{ name: 'Apr', 2024: 750 },
	{ name: 'May', 2024: 500 },
	{ name: 'Jun', 2024: 850 },
	{ name: 'Jul', 2024: 700 },
	{ name: 'Aug', 2024: 750 }
];

const BarChartComponent = () => {
	return (
		<div className="w-full rounded-xl bg-[#1D1F24] p-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-body/5-regular font-bold text-white">Pendapatan</h2>
				<div className="flex gap-2 text-body/5-regular text-[#C3C9D1]">
					lihat detail {iconSvg.arrowLightSvg}
				</div>
			</div>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<defs>
						<linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#FE9D73" />
							<stop offset="100%" stopColor="#EC290A" />
						</linearGradient>
					</defs>
					<XAxis dataKey="name" tickLine={false} tick={{ fill: '#F7F8F8' }} />
					<YAxis axisLine={true} tick={{ fill: '#848E9C' }} />
					<Tooltip
						cursor={false}
						contentStyle={{
							backgroundColor: '#2B2F38',
							border: 'none',
							borderRadius: '8px'
						}}
						itemStyle={{ color: '#fff' }}
					/>
					<Bar
						dataKey="2024"
						stackId="a"
						fill="url(#barGradient)"
						barSize={44}
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default BarChartComponent;
