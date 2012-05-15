var fs = require('fs')
var Parser

module.exports = function () {
    Parser = require('less').Parser
    return {
        contentType: 'text/css',
        renderFile: render
    }
}

function render (file, cb) {
    var parser = new Parser({
        filename: file,
        paths: this.root ? [this.root] : null
    })

    fs.readFile(file, 'utf8', function (error, string) {
        if (error) return cb(error)
        parser.parse(string, function (err, tree) {
            if (err) return cb(err)
            try {
                var out = tree.toCSS()
            }
            catch (e) {
                return cb(e)
            }
            cb(null, out)
        })
    })
}