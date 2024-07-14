const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    addMessage(message.text, 'bot');
});

chatForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const message = userInput.value;
    addMessage(message, 'user');
    socket.send(JSON.stringify({ text: message }));
    userInput.value = '';
});

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
