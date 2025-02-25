const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function () {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    const stageElement = document.getElementById(data.stage);

    if (stageElement) {
        const statusElement = stageElement.querySelector('.status');
        statusElement.textContent = data.status;

        // Remove any existing status classes
        statusElement.classList.remove('success', 'processing');

        if (data.status === 'Success') {
            statusElement.classList.add('success');
            removeSpinner(stageElement);
        } else if (data.status === 'Processing') {
            statusElement.classList.add('processing');
            addSpinner(stageElement);
        }
    }
});

document.getElementById('simulateButton').addEventListener('click', function () {
    socket.send('start-simulation');
});

function addSpinner(stageElement) {
    if (!stageElement.querySelector('.spinner')) {
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        stageElement.appendChild(spinner);
    }
}

function removeSpinner(stageElement) {
    const spinner = stageElement.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}