var Point = require('./point');

function Screen(startPoint, endPoint, deltaRes) {
    this.startPoint = new Point(startPoint.x, startPoint.y);
    this.endPoint = new Point(endPoint.x, endPoint.y);
    this.deltaRes = new Point(deltaRes.x, deltaRes.y);
}

Screen.prototype.intersectsQuery = function(db) {
    // Where boxed path overlaps screen view.
    return db.manyOrNone(`SELECT *
        FROM paths
        WHERE box(polygon(points)) && box '(($1^,$2^),($3^,$4^))'
        ORDER BY timestamp ASC
    `, [
        this.startPoint.x, this.startPoint.y,
        this.endPoint.x, this.endPoint.y
    ]);
};

module.exports = Screen;
