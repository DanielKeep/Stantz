
var UNDEF;

var _importWaiting = {};
var _importCallbacks = [];

if( this.console == UNDEF )
{
    var console =
    {
        info: function(msg) {},
    };
}

function _importProcessCallbacks()
{
    var done = true;

    for( var k in _importWaiting )
        if( _importWaiting[k] )
        {
            done = false;
            break;
        }

    if( done )
    {
        console.info('processing import callbacks');

        var callbacks = _importCallbacks;
        _importCallbacks = [];

        for( var i=0; i<callbacks.length; ++i )
            callbacks[i]();
    }
}

console.info('document: %o', this.document);

if( this.document )
{
    console.info('using document importing');

    var import = function()
    {
        for( var i=0; i<arguments.length; ++i )
            importOne(arguments[i]);
    }

    var importOne = function(src)
    {
        console.info('importing "'+src+'"');

        src = 'stantz/'+src+'.js';

        if( _importWaiting[src] == false )
            return;

        _importWaiting[src] = true;

        var head = document.getElementsByTagName('head').item(0);
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);
        head.appendChild(script);

        var onDone = function()
        {
            _importWaiting[src] = false;
            _importProcessCallbacks();
        }

        script.onreadystatechange = function()
        {
            if( js.readyState == 'complete')
                onDone();
        };

        script.onload = function()
        {
            onDone();
        };
    }

    var onImportsComplete = function(fn)
    {
        _importCallbacks[_importCallbacks.length] = fn;
        _importProcessCallbacks();
    }
}
else
{
    console.info('using worker importing');

    var import = function()
    {
        var scripts = [];

        for( var i=0; i<arguments.length; ++i )
            scripts[i] = arguments[i] + '.js';

        importScripts.apply(null, scripts);
    }

    var onImportsComplete = function(fn)
    {
        fn();
    }
}

var stantz =
{
    objects:
    {
    },

    materials:
    {
    },

    renderers:
    {
    },

    mkObj: function(obj, properties)
    {
        for( k in properties )
        {
            obj[k] = properties[k];
        }

        return obj;
    },
};

import('ray', 'rgba', 'v3');
import('materials', 'objects', 'output', 'renderers', 'scene');

