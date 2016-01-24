var Point = require('./point');

function Screen(startPoint, endPoint) {
    this.startPoint = new Point(startPoint.latitude, startPoint.longitude);
    this.endPoint = new Point(endPoint.latitude, endPoint.longitude);
}

Screen.prototype.intersectsQuery = function(db) {
    // Where boxed path overlaps screen view.
    return db.manyOrNone(`SELECT color,points
        WHERE box(polygon(points)) && box '(($1,$2),($3,$4))'
        ORDER BY timestamp ASC
    `, [
        this.startPoint.latitude, this.startPoint.longitude,
        this.endPoint.latitude, this.endPoint.longitude
    ]);
};

module.exports = Screen;
