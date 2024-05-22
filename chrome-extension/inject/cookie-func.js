export function setCookie(key, value, days) {
	document.cookie = `${key}=${value}; max-age=${days * 24 * 60 * 60}; path=/`;
}

export function getCookie(key) {
	let name = key + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (const element of ca) {
		let c = element;
		while (c.startsWith(" ")) {
			c = c.substring(1);
		}
		if (c.startsWith(name)) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export function getListFromCookie(key) {
	if (document.cookie.includes(key)) {
		return JSON.parse(getCookie(key));
	}
	return [];
}

export function appendToListInCookie(key, value) {
	let list = [];
	if (document.cookie.includes(key)) {
		list = JSON.parse(getCookie(key));
	}
	list.push(value);
	setCookie(key, JSON.stringify(list), 1);
}

export function deleteCookie(key) {
	document.cookie = `${key}=; max-age=0; path=/`;
}

export function deleteAllCookies() {
	const cookies = document.cookie.split(";");
	for (const element of cookies) {
		const cookie = element;
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
	}
}

export function getDictFromCookie(key) {
	if (document.cookie.includes(key)) {
		return JSON.parse(getCookie(key));
	}
	return {};
}

export function updateValueDictInListCookie(key, value) {
	let list = [];
	if (document.cookie.includes(key)) {
		list = JSON.parse(getCookie(key));
	}
	const index = list.findIndex((item) => item.url === value.url);
	if (index !== -1) {
		list[index] = value;
		setCookie(key, JSON.stringify(list), 1);
	}
}
