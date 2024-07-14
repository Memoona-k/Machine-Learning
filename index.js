const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
const port = 3000;

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
    ws.on('message', async function incoming(message) {
        const parsedMessage = JSON.parse(message);
        const userMessage = parsedMessage.text;

        const botResponse = await getChatGPTResponse(userMessage);
        ws.send(JSON.stringify({ text: botResponse }));
    });
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

async function getChatGPTResponse(message) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: message,
            max_tokens: 150
        })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}
