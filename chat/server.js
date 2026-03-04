const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve static client files from "public" (we'll put chat.html there)
app.use(express.static(__dirname + '/public'));

// simple API for history and management
app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages/clear', (req, res) => {
    messages = [];
    persistMessages();
    io.emit('chatCleared');
    res.sendStatus(204);
});

// persistent messages stored on disk
const fs = require('fs');
const path = require('path');
const storagePath = path.join(__dirname, 'messages.json');

// load existing messages from file, or initialize empty array
let messages = [];
try {
    if (fs.existsSync(storagePath)) {
        const raw = fs.readFileSync(storagePath, 'utf8');
        messages = JSON.parse(raw) || [];
    } else {
        fs.writeFileSync(storagePath, '[]');
    }
} catch (e) {
    console.error('failed to read message storage, starting empty', e);
    messages = [];
}

// helper to flush messages array to disk
function persistMessages() {
    fs.writeFile(storagePath, JSON.stringify(messages, null, 2), err => {
        if (err) console.error('failed to persist messages', err);
    });
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // send existing messages to the new client
  socket.emit('initialMessages', messages);

  socket.on('chatMessage', (msg) => {
    const entry = { id: socket.id, text: msg, time: Date.now() };
    messages.push(entry);
    persistMessages();
    // broadcast to everyone including sender
    io.emit('chatMessage', entry);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`chat server listening on http://localhost:${PORT}`);
});