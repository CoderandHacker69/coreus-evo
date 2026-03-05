const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["*", "https://coreus.vercel.app", "http://localhost:3000", "http://localhost:5000"],
        methods: ["GET", "POST"],
        credentials: false
    },
    transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());
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

// helper to flush messages array to disk with batching
let _writePending = false;
let _writeQueued = false;

function persistMessages() {
    // if a write is already in progress, mark that another write is needed afterwards
    if (_writePending) {
        _writeQueued = true;
        return;
    }

    _writePending = true;
    fs.writeFile(storagePath, JSON.stringify(messages, null, 2), err => {
        _writePending = false;
        if (err) {
            console.error('failed to persist messages', err);
        }
        if (_writeQueued) {
            _writeQueued = false;
            // schedule immediate second write
            persistMessages();
        }
    });
}


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // send existing messages to the new client
  socket.emit('initialMessages', messages);

  socket.on('chatMessage', (msg) => {
    // restrict message length to reasonable size
    const trimmed = String(msg).slice(0, 1000);
    const entry = { id: socket.id, text: trimmed, time: Date.now() };

    messages.push(entry);
    // keep last 1000 messages to avoid giant memory usage
    if (messages.length > 1000) messages.shift();

    // persist asynchronously (batched)
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