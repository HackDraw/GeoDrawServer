function Path(color, points) {
    this.color = color;
    this.points = points;
}

Path.prototype.postQuery = function(db) {
    var path = '(';
    for(var i = 0; i < this.path.length; i++) {
        path += `(${this.points[i].latitude}, ${this.points[i].longitude})`
        if(i < this.path.length - 1) {
            path += ',';
        }
    }
    path += ')';
    return db.none(`INSERT INTO paths
        (color, path) VALUES ('%$1^%', path '%$2^%');
    `, [ this.color, path ]);
};

module.exports = Path;
