const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let timerValue = 0;
let breakStatus = false;
let queue = [];
let title = '';
let subtitle = '';
let description = '';

io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current state to the new client
    socket.emit('initialState', {
        timerValue,
        breakStatus,
        queue,
        title,
        subtitle,
        description
    });

    // Listen for timer updates
    socket.on('updateTimer', (data) => {
        timerValue = data.timerValue;
        io.emit('timerUpdated', { timerValue });
    });

    // Listen for break status updates
    socket.on('updateBreakStatus', (data) => {
        breakStatus = data.breakStatus;
        io.emit('breakStatusUpdated', { breakStatus });
    });

    // Listen for queue updates
    socket.on('updateQueue', (data) => {
        queue = data.queue;
        io.emit('queueUpdated', { queue });
    });

    // Listen for title, subtitle, and description updates
    socket.on('updateText', (data) => {
        title = data.title;
        subtitle = data.subtitle;
        description = data.description;
        io.emit('textUpdated', { title, subtitle, description });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Serve the front-end files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
