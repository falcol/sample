console.log("inject/login-and-screenshot.js");

var index = 0;

function deleteCookie(key) {
	document.cookie = `${key}=; max-age=0; path=/`;
}

actionLoginScreenShot(index);

function actionLoginScreenShot(index) {
	const listUser = [
		{ username: "operation_creater", password: "aA123456@" },
		{ username: "operation_approver", password: "aA123456@" },
	];
	if (index >= listUser.length) {
		return;
	}

	const username = listUser[index].username;
	const password = listUser[index].password;
	index += 1;
	loginThenScreenShot(username, password);
	let timeIn = setInterval(function () {
		let logoutButton = document.evaluate(
			`//span[contains(., '${username}')]`,
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		// get by class ant-notification then remove
		let notification = document.getElementsByClassName("ant-notification");
		if (notification.length > 0) {
			notification[0].remove();
		}
		if (logoutButton) {
            // get loading icon by class .loading-icon
            let loadingIcon = document.getElementsByClassName("loading-icon");
            if (loadingIcon.length == 0) {
                // capture(username, index);
				captureScreen(username, index);

                clearInterval(timeIn);
            }
		}
	}, 1000);
}

function loginThenScreenShot(username, password) {
	// Find the username and password fields and fill them with the provided data
	// Find the input element by its ID
	const inputUserName = document.getElementById("username");
	// Set the value attribute of the input element
	inputUserName.setAttribute("value", username);
	// Dispatch a change event to simulate user input
	inputUserName.dispatchEvent(new Event("input", { bubbles: true }));

	const inputPassword = document.getElementById("password");
	inputPassword.setAttribute("value", password);
	inputPassword.dispatchEvent(new Event("input", { bubbles: true }));

	// Get element by text ログイン
	let loginButton = document.evaluate(
		"//button[contains(., 'ログイン')]",
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;
	loginButton.click();
}

function logout(username, index) {
	// get element by class hidden md:block text-ellipsis overflow-hidden max-w-[300px]
	let logoutSelect = document.evaluate(
		`//span[contains(., '${username}')]`,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;
	logoutSelect.click();
	// Get element by text ログアウト
	setTimeout(() => {
		let logoutButton = document.evaluate(
			"//li[contains(., 'ログアウト')]",
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		logoutButton.click();
		let checkLogin = setInterval(() => {
            const inputUserName = document.getElementById("username");
            if (inputUserName) {
                actionLoginScreenShot(index);
                clearInterval(checkLogin);
            }
		}, 1000);
	}, 1000);
}

async function capture(username, index) {
	try {
		const stream = await navigator.mediaDevices.getDisplayMedia({
			video: {
				cursor: "always"
			},
			audio: false,
			preferCurrentTab: true,
		});

		const vid = document.createElement("video");
		vid.addEventListener("loadedmetadata", function () {
			const canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
			ctx.canvas.width = vid.videoWidth;
			ctx.canvas.height = vid.videoHeight;
			ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
			stream.getVideoTracks()[0].stop();
			let a = document.createElement("a");
			a.download = `screenshot_${username}.png`;
			a.href = canvas.toDataURL("image/png");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
		vid.srcObject = stream;
		vid.play();
		logout(username, index);
	} catch (error) {
		console.error("Error accessing media devices:", error);
	}
}

function captureScreen(username, index) {
	const inDivRemoveClass = document?.getElementsByClassName("ant-space-item")[5]
    const element = inDivRemoveClass?.getElementsByTagName("div")[1];
    element?.classList?.remove('ant-row');

    const content = document.getElementById("root"); // Capture entire document

    // Use dom-to-image to capture the content
    domtoimage.toPng(content, { width: content.clientWidth, height: content.clientHeight })
        .then(function (dataUrl) {
			element?.classList?.add('ant-row');
            // Download the image
            let link = document.createElement('a');
            link.download = `screenshot_${username}.png`;
            link.href = dataUrl;
            link.click();
			logout(username, index);
        })
        .catch(function (error) {
            console.error('Error capturing HTML as image: ', error);
        });
}
