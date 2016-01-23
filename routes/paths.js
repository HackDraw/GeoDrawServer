var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var db = require('../models/database.js');

/* POST paths listing. */
router.post('/', function(req, res, next) {
    req.accepts('application/json');
    console.log(req.body);
    db.query()
    res.send(req.body);
});

module.exports = router;
