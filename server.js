var http = require('http'),
    url = require('url'),
    path = require('path'),
    qs = require('querystring'),
    fs = require('fs');
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "manifest": "text/cache-manifest",
    "css": "text/css"};

var serveFile = function(res, filename) {
    fs.stat(filename, function(err, stats) {
        if (stats && stats.isFile()) {
            var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
            res.writeHead(200, {'Content-Type': mimeType });
            var fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        } else if (stats && stats.isDirectory()) {
            serveFile(res, path.join(filename, "index.html"));
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
        }
    });
};

var addressClients = [];

function registerAddressStreamClient(req, res) {
    var requestUrl = url.parse(req.url, true);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    var lastAddressTime = new Date(parseInt(requestUrl.query.lastAddressTime));
    addressClients.push(res);
    console.log("Sending addresses after " + lastAddressTime);
    for (var i=0; i<addresses.length; i++) {
        if (addresses[i].serverTime > lastAddressTime) {
            console.log("Sending address: " + addresses[i]);
            res.write("data: " + JSON.stringify({ address: addresses[i] }) + '\n\n');
        }
    }
    res.on('close', function () {
        var idx = addressClients.indexOf(res);
        if (idx >= 0) {
            addressClients.splice(idx, 1);
        }
    });
}

var addresses = [
    { id: 1, serverTime: new Date(2012, 11, 10, 2, 2, 2),
      fullName: "Cheburska", address: "домик друзья" },
    { id: 2, serverTime: new Date(2012, 11, 10, 2, 2, 3),
      fullName: "Darth Vader", address: "Death Star" },
    { id: 3, serverTime: new Date(2012, 11, 10, 2, 2, 4),
      fullName: "Chuck Norris", address: "Texas" }
];

http.createServer(function (req, res) {
    var requestUrl = url.parse(req.url);
	console.log(requestUrl.pathname);
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        console.log("Setting up stream " + requestUrl.pathname);
        if (requestUrl.pathname == '/stream/addresses') {
            registerAddressStreamClient(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else if (req.method == 'POST') {
        var data = "";
        req.on("data", function(chunk) { data += chunk; });
        req.on("end", function() {
            var addresses = JSON.parse(data);
			for (var i=0; i<addresses.length; i++) {
				var address = addresses[i];
				address.serverTime = new Date();
				addresses.push(address);
				for (var i = 0; i < addressClients.length; i++) {
					addressClients[i].write("data: " + JSON.stringify({ address: address }) + '\n\n');
				}
			}
        });
        res.writeHead(200);
        res.end();
    } else {
        var uri = url.parse(req.url).pathname;
        var filename = path.join(process.cwd(), "public", uri);
        serveFile(res, filename);
    }
}).listen(1337);
