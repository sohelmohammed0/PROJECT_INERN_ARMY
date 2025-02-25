const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', socket => {
    console.log('Client connected');

    socket.on('message', message => {
        console.log(`Received message => ${message}`);
    });

    // Simulate pipeline stages with delays
    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'code-pushed', status: 'Success' }));
    }, 2000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'github-actions', status: 'Processing' }));
    }, 4000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'github-actions', status: 'Success' }));
    }, 6000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'docker-build', status: 'Processing' }));
    }, 8000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'docker-build', status: 'Success' }));
    }, 10000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'deployment', status: 'Processing' }));
    }, 12000);

    setTimeout(() => {
        socket.send(JSON.stringify({ stage: 'deployment', status: 'Success' }));
    }, 14000);
});

console.log('WebSocket server is running on ws://localhost:8080');