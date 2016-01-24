var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var connObj = require('../models/database').getConnectionObj();

var Path = require('../models/path');

/* POST paths listing. */
router.post('/', function(req, res, next) {
    req.accepts('application/json');
    console.log(req.body);
    var db = pgp(connObj);
    var pathJson = JSON.parse(req.body);
    var path = new Path(pathJson.color, pathJson.points);
    path.postQuery(db)
        .then(function(data) {
            res.sendStatus(201);
        })
        .catch(function(error) {
            res.sendStatus(500);
        });
});

module.exports = router;
