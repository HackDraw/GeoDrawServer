var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    res.send("Here\'s a path.");
});
module.exports = router;
