
var UNDEF;

var stantz = {};

stantz._importWaiting = {};
stantz._importCallbacks = [];

if( this.console == UNDEF )
{
    if( this.document )
    {
        var console =
        {
            info: function() {},
        };
    }
    else
    {
        var console =
        {
            info: function()
            {
                var args = [];
                for( var i=0; i<arguments.length; ++i )
                    args[i] = arguments[i];
                postMessage
                ({
                    type: 'console.info',
                    args: args,
                });
            },
        };
    }
}

stantz._importProcessCallbacks = function()
{
    var done = true;

    for( var k in stantz._importWaiting )
        if( stantz._importWaiting[k] )
        {
            done = false;
            break;
        }

    if( done )
    {
        console.info('processing import callbacks');

        var callbacks = stantz._importCallbacks;
        stantz._importCallbacks = [];

        for( var i=0; i<callbacks.length; ++i )
            callbacks[i]();
    }
}

console.info('document: %o', this.document);

if( this.document )
{
    console.info('using document importing');

    stantz.importScripts = function()
    {
        for( var i=0; i<arguments.length; ++i )
            stantz._importOne(arguments[i]);
    }

    stantz._importOne = function(src)
    {
        console.info('importing "'+src+'"');

        src = 'stantz/'+src+'.js';

        if( stantz._importWaiting[src] == false )
            return;

        stantz._importWaiting[src] = true;

        var head = document.getElementsByTagName('head').item(0);
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);
        head.appendChild(script);

        var onDone = function()
        {
            stantz._importWaiting[src] = false;
            stantz._importProcessCallbacks();
        }

        script.onreadystatechange = function()
        {
            if( script.readyState == 'complete')
                onDone();
        };

        script.onload = function()
        {
            onDone();
        };
    }

    stantz.onImportsComplete = function(fn)
    {
        stantz._importCallbacks[stantz._importCallbacks.length] = fn;
        stantz._importProcessCallbacks();
    }
}
else
{
    console.info('using worker importing');

    stantz.importScripts = function()
    {
        var scripts = [];

        for( var i=0; i<arguments.length; ++i )
            scripts[i] = arguments[i] + '.js';

        importScripts.apply(null, scripts);
    }

    stantz.onImportsComplete = function(fn)
    {
        fn();
    }
}

stantz.objects = {};

stantz.materials = {};

stantz.renderers = {};

stantz.mkObj = function(obj, properties)
{
    for( k in properties )
    {
        obj[k] = properties[k];
    }

    return obj;
};

stantz.importScripts('ray', 'rgba', 'v3');
stantz.importScripts('materials', 'objects', 'output', 'renderers', 'scene');

