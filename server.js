#!/usr/bin/env node

/**
 * Simple HTTP Server for VoteSecure Election Wizard
 * 
 * Usage: node server.js
 * Then visit: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Default to index.html for root
    let filePath = req.url === '/' ? 'index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }

        const ext = path.extname(filePath);
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  VoteSecure Election Wizard Server Started                   ║
║                                                                ║
║  🚀 Open: http://localhost:${PORT}                              ║
║                                                                ║
║  Click "Create Election" to start the wizard                  ║
║                                                                ║
║  Press Ctrl+C to stop the server                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});
