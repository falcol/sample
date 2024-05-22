// cookie proxy
function proxyCookie() {
	const cookieDesc =
		Object.getOwnPropertyDescriptor(Document.prototype, "cookie") || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");
	if (cookieDesc && cookieDesc.configurable) {
		Object.defineProperty(document, "cookie", {
			get: function () {
				return cookieDesc.get.call(document);
			},
			set: function (val) {
				// console.log("set cookie", val);
				cookieDesc.set.call(document, val);
			},
		});
	}
}

function localStorageProxy() {
	const localStorageDesc = Object.getOwnPropertyDescriptor(Window.prototype, "localStorage");
	if (localStorageDesc && localStorageDesc.configurable) {
		Object.defineProperty(window, "localStorage", {
			get: function () {
				return localStorageDesc.get.call(window);
			},
			set: function (val) {
				// console.log("set localStorage", val);
				localStorageDesc.set.call(window, val);
			},
		});
	}
}

proxyCookie();
localStorageProxy();
