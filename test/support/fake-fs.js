var extname = require('path').extname

module.exports = Fs

function Fs (paths) {
    this.root = {}
}

Fs.prototype.paths = function (dir, items) {
    if (Array.isArray(dir)) {
        items = dir
        dir = ''
    }
    if (!items) return this._add(dir)
    items.forEach(function (item) {
        this._add(dir ? (dir + '/' + item) : item)
    }, this)
    return this
}

Fs.prototype._add = function (item) {
    var segs = item.split('/')
    var dir = this.root
    for (var i = 0; i < segs.length - 1; i++) {
        dir = dir[segs[i]] || (dir[segs[i]] = {})
    }
    dir[segs[i]] = extname(segs[i]) ? 'file' : {}
    return this
}


Fs.prototype.stat = function (path, cb) {
    var item = this._getPath(path)
    if (!item) return cb(FsError('ENOENT'))
    cb(null, item == 'file'
        ? new Stat
        : new Stat(true)
    )
}

Fs.prototype.readdir = function (dir, cb) {
    var item = this._getPath(dir)
    if (!item) return cb(FsError('ENOENT'))
    if (item == 'file') return cb(FsError('ENOTDIR'))
    cb(null, Object.keys(item))
}

Fs.prototype._getPath = function (path) {
    path = path.replace('\\', '/') // windows support
    var segs = path.split('/')
    var item = this.root
    for (var i = 0; i < segs.length; i++) {
        item = item[segs[i]]
        if (!item) return
    }
    return item
}


function Stat (isDir) {
    this._isDir = isDir
}

Stat.prototype.isDirectory = function () {
    return !!this._isDir
}

function FsError (code) {
    var err = new Error
    err.code = code
    return err
}