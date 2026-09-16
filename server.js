import http from 'http';
import fs from 'fs';
import { WebSocket, WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
	const files = {
		'/': { path: './public/index.html', contentType: 'text/html' },
		'/script.js': {
			path: './public/script.js',
			contentType: 'text/javascript',
		},
	};
	const file = files[req.url];

	if (!file) {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not found');
		return;
	}

	fs.readFile(file.path, (err, data) => {
		if (err) {
			res.writeHead(500);
			res.end('Error loading page');
			return;
		}

		res.writeHead(200, { 'Content-Type': file.contentType });
		res.end(data);
	});
});

const wss = new WebSocketServer({ server });

function broadcast(payload) {
	const message = JSON.stringify(payload);

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
}

wss.on('connection', (socket, req) => {
	const username = new URL(req.url, 'http://localhost').searchParams.get(
		'username',
	);

	broadcast({ type: 'system', text: `${username} joined` });

	socket.on('message', (data) => {
		const { username, text } = JSON.parse(data.toString());
		broadcast({ type: 'chat', username, text });
	});

	socket.on('close', () => {
		broadcast({ type: 'system', text: `${username} left` });
	});
});

server.listen(PORT, () => {
	console.log(`Chat server running at http://localhost:${PORT}`);
});
