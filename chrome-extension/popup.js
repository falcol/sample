/***
 * How to debug popup.js?
 *    Right click the extension's button, then 'Inspect Popup'
 */

/**
 * First function: getTitle
 *  1. get dom title via chrome.tabs.sendMessage
 *      1. active tab receive this request via chrome.tabs.sendMessage
 *      1. active tab will send title back
 *  2. show title in popup.html
 */

/**
 * 3. TestWindow
 */
function loginAndScreenShot() {
	// Initialize button color
	const el = document.getElementById("loginAndScreenShot");
	el.addEventListener("click", async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		chrome.scripting
			.executeScript({
				target: { tabId: tab.id },
				files: ["lib/dom-to-image.min.js", "inject/login-and-screenshot.js"],
				world: "MAIN",
			})
			.then((documents) => {
				console.log(documents[0]); //好像没啥用，只有documentId信息
				// 通信话，请使用chrome.tabs.sendMessage （如上例）
			});
	});
}
loginAndScreenShot();

function screenShot() {
	// Initialize button color
	const el = document.getElementById("screenShot");
	el.addEventListener("click", async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		chrome.scripting
			.executeScript({
				target: { tabId: tab.id },
				files: ["lib/html2canvas.min.js", "lib/dom-to-image.min.js", "inject/screen-shot.js"],
				world: "MAIN",
			})
			.then((documents) => {
				console.log(documents[0]); //好像没啥用，只有documentId信息
				// 通信话，请使用chrome.tabs.sendMessage （如上例）
			});
	});
}
screenShot();
