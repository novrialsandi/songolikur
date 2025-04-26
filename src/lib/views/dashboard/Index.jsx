"use client";
import { useState } from "react";
import QuillEditor from "../../components/QuillEditor";

const Dashboard = () => {
	const [content, setContent] = useState("");

	const handleSave = () => {
		console.log("Saved content:", content);
		alert("Content saved successfully!");
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

			<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Rich Text Editor</h2>

				{/* Quill Editor Container */}
				<div className="mb-4 border rounded-lg">
					<QuillEditor onChange={setContent} />
				</div>

				<div className="flex justify-end">
					<button
						onClick={handleSave}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
					>
						Save Content
					</button>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Preview</h2>
				<div
					className="prose max-w-none p-4 border rounded-lg min-h-32"
					dangerouslySetInnerHTML={{ __html: content }}
				></div>
			</div>
		</div>
	);
};

export default Dashboard;
