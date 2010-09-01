
var __STANTZ_WORKER = true;

importScripts('stantz.js');

stantz.worker =
{
    scene: null,
};

onmessage = function(event)
{
    if( event.data[0] == ".eval" )
    {
        postMessage(eval(event.data[1]));
    }
    else if( event.data[0] == ".keys" )
    {
        var keys = [];
        for( var name in self )
            keys[keys.length] = name;
        postMessage(keys);
    }
    else if( event.data[0] == ".loadScene" )
    {
        stantz.worker.scene = stantz.Scene.fromJson(event.data[1]);
    }
    else if( event.data[0] == ".renderTile" )
    {
        var renderer = stantz.renderers[event.data[1]];
        var params = event.data[2];

        var output = new stantz.output.Buffer(
                params.tileX, params.tileY,
                params.tileW, params.tileH);

        output.begin();
        renderer.render(stantz.worker.scene, output,
            {
                width: params.width,
                height: params.height,
                tileX: params.tileX,
                tileY: params.tileY,
                tileW: params.tileW,
                tileH: params.tileH,
                multisample: params.multisample,
            });
        output.finish();

        postMessage({type:'tile',tile:output});
    }
    else
        postMessage(this[event.data[0]] || self[event.data[0]]);
};

