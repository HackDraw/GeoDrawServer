function Path(color, path) {
    this.color = color;
    this.path = path;
}

Path.prototype.postQuery = function(db) {
    var path = '(';
    for(let i = 0; i < this.path.length; i++) {
        path += `(${this.path[i].latitude}, ${this.path[i].longitude})`
        if(i < this.path.length - 1) {
            path += ',';
        }
    }
    path += ')';
    return db.none(`INSERT INTO paths
        (color, path) VALUES ('$1', path '$1');
    `, [ this.color, path ]);
};

modules.export = Path;
