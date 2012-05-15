module.exports = function () {
    var renderFile = require('jade').renderFile
    return {
        renderFile: function (file, cb) {
            renderFile(file, this, cb)
        },
        contentType: 'text/html'
    }
}