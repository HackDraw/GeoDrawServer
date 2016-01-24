function Path(color, points) {
    this.color = color;
    this.points = points;
}

Path.prototype.postQuery = function(db) {
    var path = '(';
    for(var i = 0; i < this.path.length; i++) {
        var x = this.points[i].latitude + 90;
        var y = this.points[i].longitude + 180;
        path += `(${x}, ${y})`
        if(i < this.path.length - 1) {
            path += ',';
        }
    }
    path += ')';
    return db.one(`INSERT INTO paths
        (color, path) VALUES ('$1^', path '$2^')
        RETURNING id;
    `, [ this.color, path ]);
};

module.exports = Path;
