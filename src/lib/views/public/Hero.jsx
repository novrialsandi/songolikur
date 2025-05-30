"use client";

import Divider from "@/lib/components/Divider";
import React from "react";
import { useState, useEffect } from "react";
import fetchApi from "@/lib/api/fetchApi";
import Link from "next/link";

const Hero = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);

	const getCollections = async () => {
		setLoading(true);
		const res = await fetchApi("/collection/public");

		if (res.status === 200) {
			const repeatedData = [];

			for (let i = 0; i < 5; i++) {
				repeatedData.push(...res.data); // Spread to flatten
			}

			setCollections(repeatedData);
		}
		setLoading(false);
	};

	console.log(collections);

	useEffect(() => {
		getCollections();
	}, []);

	return (
		<>
			{!loading && (
				<div className="flex h-screen gap-8">
					<div className="flex w-1/4">
						<div>
							<img
								className="aspect-video"
								src="/placeholder.webp"
								alt="gambar"
							/>
						</div>
					</div>

					<Divider orientation="vertical" />

					<div className="flex w-2/4">
						<div>
							<Link href={`/read/${collections[0].slug}`}>
								<img
									className="aspect-video  object-cover rounded-md"
									src={collections[0].thumbnail || "/placeholder.webp"}
									alt="gambar"
								/>
							</Link>
						</div>
					</div>

					<Divider orientation="vertical" />

					<div className="flex w-1/4">
						<div>
							<img
								className="aspect-video"
								src="/placeholder.webp"
								alt="gambar"
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Hero;
