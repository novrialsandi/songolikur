import React from "react";
import Hero from "./Hero";
import ListCollections from "./ListCollections";

const Index = ({ collections }) => {
	return (
		<div className="space-y-8">
			<Hero collections={collections} />
			<ListCollections collections={collections} />
		</div>
	);
};

export default Index;
