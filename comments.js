// Create webserver that serves the comments.json file
// and allows users to post to it

var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var COMMENTS_FILE = 'comments.json';

// Load comments from file
function loadComments(callback) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    callback(JSON.parse(data));
  });
}

// Save comments to file
function saveComments(comments, callback) {
  fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    callback();
  });
}

// Handle GET requests
function handleGet(request, response) {
  var urlParts = url.parse(request.url, true);
  var query = urlParts.query;
  var path = urlParts.pathname;
  if (path === '/comments') {
    loadComments(function(comments) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(comments));
    });
  } else {
    response.statusCode = 404;
    response.end('Not found');
  }
}

// Handle POST requests
function handlePost(request, response) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var comment = querystring.parse(body);
    loadComments(function(comments) {
      comments.push(comment);
      saveComments(comments, function() {
        response.statusCode = 201;
        response.end('Created');
      });
    });
  });
}

// Create web server
var server = http.createServer(function(request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  }
});

// Start web server
server.listen(8080, function() {
  console.log('Server listening on port 8080');
});
