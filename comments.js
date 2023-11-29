// Create webserver
// Import http module
const http = require('http');

// Define the request handling function
const requestHandler = (request, response) => {
    response.end('Hello World');
}

// Create the server
const server = http.createServer(requestHandler);

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});