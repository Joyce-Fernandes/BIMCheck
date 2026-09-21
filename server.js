const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Mapeamento de tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.ifc': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
    // Parse da URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Remove trailing slash
    if (pathname.endsWith('/') && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
    }
    
    // Define o caminho do arquivo
    let filePath;
    if (pathname === '/' || pathname === '') {
        filePath = path.join(__dirname, 'src', 'index.html');
    } else if (pathname === '/docs' || pathname === '/docs/') {
        // Rota específica para documentação
        filePath = path.join(__dirname, 'docs', 'index.html');
    } else if (pathname.startsWith('/src/')) {
        // Remove o /src/ do início para acessar os arquivos
        filePath = path.join(__dirname, 'src', pathname);
    } else if (pathname === '/dashboard') {
        filePath = path.join(__dirname, 'src', 'dashboard.html');
    } else {
        filePath = path.join(__dirname, 'src', pathname);
    }
    
    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Arquivo não encontrado
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>404 - File not found</title></head>
                    <body>
                        <h1>404 - File not found</h1>
                        <p>The requested file was not found: ${pathname}</p>
                        <p><a href="/">Back to main page</a></p>
                    </body>
                </html>
            `);
            return;
        }
        
        // Verifica se é um diretório
        fs.stat(filePath, (statErr, stats) => {
            if (statErr) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>500 - Internal error</title></head>
                        <body>
                            <h1>500 - Internal server error</h1>
                            <p>Error checking file: ${statErr.message}</p>
                        </body>
                    </html>
                `);
                return;
            }
            
            if (stats.isDirectory()) {
                // Se for um diretório, tenta servir index.html
                const indexPath = path.join(filePath, 'index.html');
                fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
                    if (indexErr) {
                        // Não há index.html, mostra lista de arquivos
                        fs.readdir(filePath, (readErr, files) => {
                            if (readErr) {
                                                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end(`
                            <html>
                                <head><title>500 - Internal error</title></head>
                                <body>
                                    <h1>500 - Internal server error</h1>
                                    <p>Error reading directory: ${readErr.message}</p>
                                </body>
                            </html>
                        `);
                                return;
                            }
                            
                            // List directory files
                            const fileList = files
                                .filter(file => !file.startsWith('.'))
                                .map(file => `<li><a href="${pathname}/${file}">${file}</a></li>`)
                                .join('');
                            
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(`
                                <html>
                                    <head><title>Documentation - BIMCheck</title></head>
                                    <body>
                                        <h1>📚 BIMCheck Documentation</h1>
                                        <p>Select a file to view:</p>
                                        <ul>${fileList}</ul>
                                        <p><a href="/">← Back to main page</a></p>
                                    </body>
                                </html>
                            `);
                        });
                        return;
                    }
                    
                    // Serve index.html
                    filePath = indexPath;
                    serveFile(filePath, res);
                });
                return;
            }
            
            // Serve the file
            serveFile(filePath, res);
        });
    });
});

// Function to serve files
function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>500 - Internal error</title></head>
                <body>
                    <h1>500 - Internal server error</h1>
                    <p>Error reading file: ${err.message}</p>
                </body>
            </html>
        `);
            return;
        }
        
        // Determine MIME type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Define headers CORS para permitir módulos ES6
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        
        res.end(data);
    });
}

server.listen(PORT, () => {
    console.log(`🚀 BIMCheck server running at http://localhost:${PORT}`);
    console.log(`📁 Main page: http://localhost:${PORT}/`);
    console.log(`📚 Documentation: http://localhost:${PORT}/docs/`);
    console.log(`\n💡 To stop the server, press Ctrl+C`);
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Interruption handling
process.on('SIGINT', () => {
    console.log('\n👋 Server stopped. Goodbye!');
    process.exit(0);
}); 