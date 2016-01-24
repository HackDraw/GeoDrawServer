var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var connObj = require('../models/database').getConnectionObj();

var Path = require('../models/path');

/* POST paths listing. */
router.post('/', function(req, res, next) {
    req.accepts('application/json');
    var db = pgp(connObj);
    var path = new Path(req.body.color, req.body.points);
    path.postQuery(db)
        .then(function(data) {
            res.sendStatus(201);
        })
        .catch(function(error) {
            res.sendStatus(500);
            console.error(error);
        });
});

module.exports = router;
