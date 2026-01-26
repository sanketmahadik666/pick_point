const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const { configureSockets } = require('./src/socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve the client-side files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configure Socket.IO components
configureSockets(io);

server.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});