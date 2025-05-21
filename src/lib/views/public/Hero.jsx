import Divider from "@/lib/components/Divider";
import React from "react";

const Hero = () => {
	return (
		<div className="flex h-screen gap-8">
			<div className="flex w-1/4">
				<div>
					<img className="aspect-video" src="/placeholder.webp" alt="gambar" />
				</div>
			</div>
			<Divider orientation="vertical" />
			<div className="flex w-2/4">
				<div>
					<img className="aspect-video" src="/placeholder.webp" alt="gambar" />
				</div>
			</div>
			<Divider orientation="vertical" />
			<div className="flex w-1/4">
				<div>
					<img className="aspect-video" src="/placeholder.webp" alt="gambar" />
				</div>
			</div>
		</div>
	);
};

export default Hero;
