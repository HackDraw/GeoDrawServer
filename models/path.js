function Path(color, points) {
    this.color = color;
    this.points = points;
}

Path.prototype.postQuery = function(db) {
    var path = this.points.map(p => `(${p.x + 90},${p.y + 180})`).join(',');
    return db.one(`INSERT INTO paths
        (color, points) VALUES ($1, path($2))
        RETURNING id;
    `, [ this.color, path ]);
};

module.exports = Path;
