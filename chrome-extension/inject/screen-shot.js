
function captureScreen() {

    const inDivRemoveClass = document?.getElementsByClassName("ant-space-item")[5]
    const element = inDivRemoveClass?.getElementsByTagName("div")[1];
    // Remove the specified class
    element?.classList?.remove('ant-row');
    // Get input by place holder ユーザー名
    let dateInput = document.evaluate("//input[@placeholder='終了日']", document, null, 9, null).singleNodeValue;
    let dateInput2 = document.evaluate("//input[@placeholder='開始日']", document, null, 9, null).singleNodeValue;
    if (dateInput.value === "") {
        dateInput.setAttribute("style", "color: rgba(0, 0, 0, 0.25);")
    }
    if (dateInput2.value === "") {
        dateInput2.setAttribute("style", "color: rgba(0, 0, 0, 0.25);")
    }
    const pickerInputs = document.querySelectorAll('.ant-picker-input');
    pickerInputs.forEach(input => {
        input.style.color = 'rgba(0, 0, 0, 0.25)';
    });
    const pickerInputs2 = document.querySelectorAll('.ant-picker');
    pickerInputs2.forEach(input => {
        input.style.color = 'rgba(0, 0, 0, 0.25)';
    });

    const content = document.getElementById("root"); // Capture entire document
    // Get the element

    // Use dom-to-image to capture the content
    domtoimage.toPng(content, { width: content.clientWidth, height: content.clientHeight })
        .then(function (dataUrl) {
            // Download the image
            // let link = document.createElement('a');
            // link.download = `screenshot.png`;
            // link.href = dataUrl;
            // link.click();

            // Get div by content ページごとの行数:

            // Create a new image element
            let img = new Image();
            img.src = dataUrl;
            element?.classList?.add('ant-row');

            // Display the image in a new window or use it as needed
            let newWindow = window.open();
            newWindow.document.write('<img src="' + img.src + '" alt="Screenshot"/>');
        })
        .catch(function (error) {
            console.error('Error capturing HTML as image: ', error);
        });
}

captureScreen();
