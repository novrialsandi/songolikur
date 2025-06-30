"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

const EditorComponent = ({ holderId = "editorjs", initialData, onChange }) => {
	const editorInstance = useRef(null);

	useEffect(() => {
		if (!editorInstance.current) {
			editorInstance.current = new EditorJS({
				holder: holderId,
				data: initialData,
				tools: {
					header: Header,
					paragraph: Paragraph,
					// Add other tools here
				},
				onChange: async () => {
					if (onChange) {
						const savedData = await editorInstance.current.save();
						onChange(savedData);
					}
				},
			});
		}

		return () => {
			if (editorInstance.current && editorInstance.current.destroy) {
				editorInstance.current.destroy();
				editorInstance.current = null;
			}
		};
	}, [holderId, initialData, onChange]);

	return <div className="w-full max-w-[740px]" id={holderId} />;
};

export default EditorComponent;
