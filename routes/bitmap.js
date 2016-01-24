var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var connObj = require('../models/database').getConnectionObj();
var Canvas = require('canvas');
var Image = Canvas.Image;

var Screen = require('../models/screen');
var Path = require('../models/path');
var Point = require('../models/point');

/* GET bitmap listing. */
router.get('/', function(req, res, next) {
    req.accepts(['json']);
    var db = pgp(connObj);
    // startPoint, endPoint, deltaResolution
    var screen = new Screen(
        new Point(parseInt(req.query.startLatitude), parseInt(req.query.startLongitude)),
        new Point(parseInt(req.query.endLatitude), parseInt(req.query.endLongitude)),
        new Point(parseInt(req.query.deltaResX), parseInt(req.query.deltaResY))
    );
    console.log(screen);
    // Query for intersecting paths. Some false positives are possible.
    screen.intersectsQuery(db)
        .then(function(data) {
            var canvas = createBitmap(screen, data);
            // Set result type to 'image/png', status code 200, and send PNG buffer.
            res.type('png').status(200).send(canvas.toBuffer());
        })
        .catch(function(error) {
            console.error(error);
            res.sendStatus(500);
        });
});

// Generates a dyanamic bitmap based on the screen Object and a list of paths.
function createBitmap(screen, paths) {
    // Set canvas resolution based on delta resolution.
    var canvas = new Canvas(screen.deltaRes.x, screen.deltaRes.y);
    var ctx = canvas.getContext('2d');
    // Clear the canvas to 100% transparency.
    ctx.clearRect(0, 0, screen.deltaRes.x, screen.deltaRes.y);

    for(var i = 0; i < paths.length; i++) {
        // Set stroke color from the path's color.
        ctx.strokeStyle = paths[i].color;
        // Set line abitrarily to 10 pixels wide.
        ctx.lineWidth = 10;
        ctx.beginPath();
        var coords = pathStringToPoints(paths[i].points);
        var point = convertCoordToXY(screen, coords[0]);
        // Move to starting point of path.
        ctx.moveTo(point.x, point.y);
        // Continue on to the second point and beyond.
        for(var j = 1; j < coords.length; j++) {
            point = convertCoordToXY(screen, coords[j]);
            ctx.lineTo(point.x, point.y);
        }
        // Draw final path.
        ctx.stroke();
    }

    return canvas;
}

// Convert the string '((1,2),(-5.1,8),...)' to a list of points.
function pathStringToPoints(pathString) {
    // Strip first and last characters, split by '),('
    var pathCoords = pathString.substring(2, pathString.length - 2).split('),(');
    var paths = [];
    for(var i = 0; i < pathCoords.length; i++) {
        // Split the two points by ','
        var path = pathCoords[i].split(',');
        // Push new point on x & y
        paths.push(new Point(parseFloat(path[0]), parseFloat(path[1])))
    }

    return paths;
}

// Convert a geographic coordinate to a drawn point for an image.
function convertCoordToXY(screen, point) {
    // Distance between the top-left and bottom-right corners.
    var deltaPoint = new Point(
        Math.abs(screen.endPoint.x - screen.startPoint.x),
        Math.abs(screen.endPoint.y - screen.startPoint.y)
    );
    // Setup point value.
    var prePoint = new Point(
        point.x - screen.startPoint.x,
        screen.endPoint.x - point.y
    );
    // Return new image point for canvas
    return new Point(
        Math.trunc((prePoint.x / deltaPoint.x) * screen.deltaRes.x),
        Math.trunc((prePoint.y / deltaPoint.y) * screen.deltaRes.y)
    );
}

module.exports = router;
