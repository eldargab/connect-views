# Connect views

This is a connect middleware. It serves templates like a static files, supports
request paths with omited extensions, has built in support for
[jade](http://jade-lang.com/),
[markdown](https://github.com/evilstreak/markdown-js),
[less](http://lesscss.org/) and [stylus](http://learnboost.github.com/stylus/).

## Examples

Serve all templates from `./public`

``` javascript
var connect = require('connect')
var Views = require('connect-views')
var app = connect()

app.use(Views({
    root: 'public'
}))
```

Pass view engine specific options

``` javascript
app.use(Views({
    root: 'public',
    stylus: {
        paths: ['styles']
    },
    markdown: {
        dialect: 'maruku'
    }
}))
```

Integrate new view engine

``` javascript
Views.engines.haml = function () {
    var haml = require('hamljs')

    return {
        contentType: 'text/html',

        render: function (str, cb) {
            try {
                var out = haml.render(str, this)
            }
            catch (e) {
                return cb(e)
            }
            cb(null, out)
        }
    }
}

Views.engines.extensions['.haml'] = Views.engines.haml
```

Serve certain file type in a specific way

``` javascript
app.use(Views({
    '.hamlxml': (function () {
        var engine = Views.engines.haml()
        engine.contentType = 'application/xml'
        engine.xml = true
        return engine
    })()
}))
```

## Customization

Several request processing steps are distinguished within module:

1. Translate request's url into a file system path
2. Lookup actual file to render
3. Create view engine instance
4. Render and send file contents

For each step there is an independent public API component doing that job. You
can always plug your own implementation for any step by monkey patching or by
passing corresponding option to `Views()`:

``` javascript
// Serve only strict paths
app.use(Views({
    pathHandler: function (path, req, res, next) {
        var opts = this

        fs.stat(path, function (error, stat) {
            if (error && error.code == 'ENOENT') return next()
            if (error) return next(error)
            opts.render(path, req, res, next)
        })
    }
}))
```

## View engine

View engine is an object with either `render(str, cb)` or `renderFile(path, cb)`
method available. Engines which are just plain text processors should use
`render` method, while engines which are able to bound several documents
together should use `renderFile`. Such convention is useful as we can rely on
file modification times for conditional gets and caching if there is only
`render` method.

There are also other conventions:

* `contentType` property

* All options are passed via `this`

* By default a new engine instance is created for each request
( with `Object.create(cachedProto)`). So it is safe to pass per request options.


## Installation

Via npm:

``` bash
$ npm install connect-views
```

To run tests install dev dependencies and launch npm test command:

``` bash
$ npm install -d
$ npm test
```

## License

(The MIT License)

Copyright (c) 2012 Eldar Gabdullin <eldargab@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.