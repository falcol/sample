import * as cookie from './cookie-func.js';
(function init() {

	// Function to inject our code into the webpage context
	function injectScript(func) {
		if (window.location.href.includes("benri.summitgco.com")){
			let actualCode = "(" + func + ")();";
				let script = document.createElement("script");
				script.textContent = actualCode;
				document.body.appendChild(script);
				script.remove();
			}
		}

		// Function to override XMLHttpRequest
		function overrideXHR() {
			let originalXhr = window.XMLHttpRequest;

			function setCookie(key, value, days) {
				document.cookie = `${key}=${value}; max-age=${days * 24 * 60 * 60}; path=/`;
			}

			function getCookie(key) {
				let name = key + "=";
				let decodedCookie = decodeURIComponent(document.cookie);
				let ca = decodedCookie.split(';');
				for (const element of ca) {
					let c = element;
					while (c.startsWith(' ')) {
						c = c.substring(1);
					}
					if (c.startsWith(name)) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			}

			function updateValueDictInListCookie(key, value) {
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

			function appendOrUpdateToListInCookie(key, value) {
				let list = [];
				if (document.cookie.includes(key)) {
					list = JSON.parse(getCookie(key));
				}
				const urlExist = list.find((item) => item.url === value.url);
				if (!urlExist) {
					list.push(value);
					setCookie(key, JSON.stringify(list), 1);
				} else {
					updateValueDictInListCookie(key, value);
				}
			}

			function newXHR() {
				// Get key for set for cookie
				let userInfo = localStorage.getItem("user_info");
				userInfo = JSON.parse(userInfo);
				const username = userInfo?.username;

				let xhr = new originalXhr();

				// Intercept the open() method
				let originalOpen = xhr.open;
				xhr.open = function (method, url) {
					// You can modify the URL or do other things here before the request is sent
					return originalOpen.apply(this, arguments);
				};

				// Intercept the send() method
				let originalSend = xhr.send;
				xhr.send = function (data) {
					return originalSend.apply(this, arguments);
				};

				// Intercept the setRequestHeader() method to track the request headers
				let originalSetRequestHeader = xhr.setRequestHeader;
				xhr.setRequestHeader = function (header, value) {
					// Store the method for later use
					return originalSetRequestHeader.apply(this, arguments);
				};

				// Intercept the onreadystatechange event to get the response
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						let res = {}
						res.status = xhr.status;
						res.url = xhr.responseURL;
						res.response = JSON.parse(xhr.response)
						console.log(res);
						if (username) {
							appendOrUpdateToListInCookie(username, res);
						}
					}
				};

				return xhr;
			}

			// Override the global XMLHttpRequest object with our custom implementation
			window.XMLHttpRequest = newXHR;
		}

		// Inject the script into the webpage context
		injectScript(overrideXHR);
})();
