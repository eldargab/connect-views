var fs = require('fs')

module.exports = function () {
    var stylus = require('stylus')

    return {
        contentType: 'text/css',

        renderFile: function (file, cb) {
            var paths = this.paths
                ? this.paths
                : this.root ? [this.root] : null

            fs.readFile(file, 'utf8', function (error, str) {
                if (error) return cb(error)
                stylus.render(str, {
                    filename: file,
                    paths: paths
                }, cb)
            })
        }
    }
}