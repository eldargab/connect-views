var basename = require('path').basename
var extname = require('path').extname

var engines = module.exports = function (ext) {
    var factory = engines.extensions[ext] || engines[ext]
    if (!factory) throw new Error(~ext.indexOf('.')
        ? 'Engine for ' + ext + ' not found'
        : 'Engine ' + ext + ' not found'
    )
    return factory()
}

require('fs').readdirSync(__dirname).forEach(function (item) {
    if (~['index.js', '.', '..'].indexOf(item)) return
    item = item.replace(/\.\w+$/, '')
    engines[item] = require('./' + item)
})

engines.extensions = {
    '.jade': engines.jade,
    '.md': engines.markdown,
    '.less': engines.less,
    '.styl': engines.stylus
}