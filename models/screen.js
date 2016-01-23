function Screen(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
}

Screen.prototype.intersectsQuery = function(db) {
    // Where boxed path overlaps screen view.
    return db.manyOrNone(`SELECT color,points
        WHERE box(polygon(points)) && box '(($1,$2),($3,$4))'
        ORDER BY timestamp ASC
    `, [
        this.startPoint.latitude, this.startPoint.longitude,
        this.endPoint.latitude, this.endPoint.longitude;
    ]);
};

module.exports = Screen;
