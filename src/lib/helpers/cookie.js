// @ts-nocheck
import Cookie from "cookie-universal";

const cookies = Cookie();

export const getCookie = (cookieName) => {
	return cookies.get(cookieName);
};

export const setCookie = (cookieName, value, expires) => {
	let expirationDate;

	if (expires === "nextMonday") {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
		const nextMonday = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + daysUntilNextMonday,
			4,
			0,
			0
		);
		expirationDate = nextMonday;
	} else {
		expirationDate = new Date();
		expirationDate.setFullYear(expirationDate.getFullYear() + 1);
	}

	return cookies.set(cookieName, value, {
		expires: expirationDate,
		path: "/",
	});
};

export const removeCookie = async (cookieName) => {
	cookies.remove(cookieName);
};

export const getNextMonday4AM = () => {};
