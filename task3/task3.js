const wsUri = "wss://echo-ws-service.herokuapp.com";

const inputNode = document.querySelector('input');
const btnNodeSubmit = document.querySelector('.j-btn-submit');
const btnNodeGeo = document.querySelector('.j-btn-geolocation');
const resultNode = document.querySelector('.j-chat');

let websocket;

function displayMessage(message, display) {
    const result = `
        <div class="message message-${display}">
            <span>${message}</span>
        </div>
    `;
    resultNode.innerHTML += result;
}

function initEchoWebSocket() {
    websocket = new WebSocket(wsUri);

    websocket.onopen = () => {
        displayMessage('Соединение установлено', 'server');
    }
    websocket.onclose = () => {
        displayMessage('Соединение закрыто', 'server');
    }
    websocket.onmessage = (event) => {
        if (displayWebsocketMsg) {
            displayMessage(event.data, 'server');
        }
    }
    websocket.onerror = () => {
        displayMessage('Ошибка соединения', 'server');
    }
}

initEchoWebSocket();
let displayWebsocketMsg = true;
btnNodeSubmit.addEventListener('click', () => {
    const message = inputNode.value;
    if (message != '') {
        displayMessage(message, 'client');
        displayWebsocketMsg = true;
        websocket.send(message);
        inputNode.value = '';
    }   
});

btnNodeGeo.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const mapLink = `https://www.openstreetmap.org/#map=18/${position.coords.latitude}/${position.coords.longitude}`;
            const message = `<a href="${mapLink}" class="link" target="_blank">Гео-локация</a>`;
            displayMessage(message, 'client');
            displayWebsocketMsg = false;
            websocket.send(message);
        });
    }
});