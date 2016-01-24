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
    var screen = new Screen(
        new Point(parseInt(req.query.startLatitude), parseInt(req.query.startLongitude)),
        new Point(parseInt(req.query.endLatitude), parseInt(req.query.endLongitude)),
        new Point(parseInt(req.query.deltaResX), parseInt(req.query.deltaResY))
    );
    screen.intersectsQuery(db)
        .then(function(data) {
            var canvas = createBitmap(screen, data);
            res.type('png').status(200).send(canvas.toBuffer());
        })
        .catch(function(error) {
            console.error(error);
            res.sendStatus(500);
        });
});

function createBitmap(screen, paths) {
    var canvas = new Canvas(screen.deltaRes.latitude, screen.deltaRes.longitude);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, screen.deltaRes.latitude, screen.deltaRes.longitude);

    for(var i = 0; i < paths.length; i++) {
        // 50% transparency
        ctx.strokeStyle = paths[i].color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        var coords = pathStringToPoints(paths[i].points);
        var point = convertCoordToXY(screen, coords[0]);
        ctx.moveTo(point.latitude, point.longitude);
        for(var j = 1; j < coords.length; j++) {
            point = convertCoordToXY(screen, coords[j]);
            ctx.lineTo(point.latitude, point.longitude);
        }
        ctx.stroke();
    }

    return canvas;
}

function pathStringToPoints(pathString) {
    var pathCoords = pathString.substring(2, pathString.length - 2).split('),(');
    var paths = [];
    for(var i = 0; i < pathCoords.length; i++) {
        var path = pathCoords[i].split(',');
        paths.push(new Point(parseFloat(path[0]), parseFloat(path[1])))
    }

    return paths;
}

function convertCoordToXY(screen, point) {
    var deltaPoint = new Point(
        Math.abs(screen.endPoint.latitude - screen.startPoint.latitude), Math.abs(screen.endPoint.longitude - screen.startPoint.longitude)
    );
    var prePoint = new Point(
        point.latitude - screen.startPoint.latitude,
        screen.endPoint.latitude - point.longitude
    );
    return new Point(
        Math.trunc((prePoint.latitude / deltaPoint.latitude) * screen.deltaRes.latitude),
        Math.trunc((prePoint.longitude / deltaPoint.longitude) * screen.deltaRes.longitude)
    );
}

module.exports = router;
