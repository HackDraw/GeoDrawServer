var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var connObj = require('../models/database.js').getConnectionObj();

/* POST paths listing. */
router.post('/', function(req, res, next) {
    req.accepts('application/json');
    console.log(req.body);
    var db = pgp(connObj);
    res.send(req.body);
});

module.exports = router;
