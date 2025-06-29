"use client";

import React from "react";
import fetchApi from "@/lib/api/fetchApi";
import { useState, useEffect } from "react";
import { listTags, listCategories } from "@/lib/constant";
import Dropdown from "@/lib/components/Dropdown";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "@/lib/components/ArticleCard";

const Collections = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		total: 1,
		page: 1,
		limit: 10,
	});

	// Function to get collection data from API
	const getCollection = async (category = "", tags = "", search = "") => {
		try {
			setLoading(true);
			const params = {};
			if (category) params.category = category;
			if (tags.length > 0) params.tags = tags.join(",");
			if (search) params.search = search;

			const res = await fetchApi.get("/collection/public", { params });

			const { data, pagination } = res.data;

			if (res.status === 200) {
				setCollections(data);
				setPagination(pagination);
			}
		} catch (error) {
			console.error("Error fetching collections:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateQuery = (category, tags) => {
		const params = new URLSearchParams(window.location.search); // ambil params yang sudah ada

		if (category) {
			params.set("category", category);
		} else {
			params.delete("category");
		}

		if (tags.length > 0) {
			params.set("tags", tags.join(","));
		} else {
			params.delete("tags");
		}

		router.push(`/read?${params.toString()}`);
	};

	// Use effect to set default values from URL
	useEffect(() => {
		const category = searchParams.get("category") || "";
		const tags = searchParams.get("tags")?.split(",") || [];
		const search = searchParams.get("search") || "";

		setSelectedCategory(category);
		setSelectedTags(tags);
		getCollection(category, tags, search);
	}, [searchParams]);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Dropdown
					items={listTags}
					type="multi"
					placeholder="Select Tags"
					defaultValue={selectedTags.length > 0 ? selectedTags : ""}
					onStateChange={(tags) => {
						setSelectedTags(tags);
						updateQuery(selectedCategory, tags);
					}}
				/>
				<div className="flex gap-2">
					{listCategories.map((category, index) => (
						<div
							key={index}
							className={`text-center border rounded-md cursor-pointer ${
								selectedCategory === category.value ? "bg-gray-200" : ""
							}`}
							onClick={() => {
								const newCategory =
									selectedCategory === category.value ? "" : category.value;
								setSelectedCategory(newCategory);
								updateQuery(newCategory, selectedTags);
							}}
						>
							<div className="p-1">{category.label}</div>
						</div>
					))}
				</div>
			</div>
			<div>
				{loading ? (
					<div>Loading...</div>
				) : (
					collections.map((val, index) => (
						<ArticleCard key={index} item={val} />
					))
				)}
			</div>
		</div>
	);
};

export default Collections;
