'use client';

import React from 'react';

const Skeleton = () => {
	return (
		<>
			<div className="flex h-full min-h-32 w-full flex-col justify-between rounded-lg border border-color/border/component-border bg-color/background/component-card p-4">
				<div className="flex h-full flex-col justify-between">
					<div className="flex justify-between">
						<div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-700"></div>
					</div>
					<div className="flex flex-grow items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-gray-500"></div>
					</div>
					<div className="text-center text-[#A2ABB8]">Memuat data</div>
				</div>
			</div>
		</>
	);
};

export default Skeleton;
