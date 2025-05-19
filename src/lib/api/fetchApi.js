import axios from "axios";
import { getCookie } from "../helpers/cookie";

// const fetchApi = axios.create({
// 	baseURL: `${process.env.NEXT_PUBLIC_SERVICE_HOST}/api`,
// });

// fetchApi.interceptors.request.use((config) => {
// 	const token = getCookie("sid");
// 	const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

// 	if (token) {
// 		config.headers.Authorization = `Bearer ${token}`;
// 	}

// 	if (secretKey) {
// 		config.headers["x-secret-key"] = secretKey;
// 	}

// 	return config;
// });

const fetchApi = axios.create({
	baseURL: "/api",
});

fetchApi.interceptors.request.use((config) => {
	const token = getCookie("sid");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default fetchApi;
