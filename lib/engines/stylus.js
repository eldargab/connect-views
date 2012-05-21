var fs = require('fs')

module.exports = function () {
    var stylus = require('stylus')

    return {
        contentType: 'text/css',

        renderFile: function (file, cb) {
            this.paths = this.paths
                ? this.paths
                : this.__root ? [this.__root] : null

            this.filename = file

            var opts = this

            fs.readFile(file, 'utf8', function (error, str) {
                if (error) return cb(error)
                stylus.render(str, opts, cb)
            })
        }
    }
}