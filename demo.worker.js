
$(document).ready(
stantz.onImportsComplete
(
    function()
    {
        console.info('Running document script');

        var canvas = $('#output')[0];
        var sceneJson = scene.toJson();
        var tileSize = 64;
        var nextTile = 0;
        var renderer = 'raytrace';
        var multisample = 4;

        var width = parseInt(canvas.width);
        var height = parseInt(canvas.height);

        var tilesPerRow = Math.ceil(width/tileSize);
        var tileRows = Math.ceil(height/tileSize);
        var totalTiles = tileRows * tilesPerRow;

        var renderTile = function(worker)
        {
            if( nextTile >= totalTiles )
                return;

            var tileX = (nextTile % tilesPerRow) * tileSize;
            var tileY = (Math.floor(nextTile / tilesPerRow)) * tileSize;
            ++ nextTile;

            //console.info('tile (%3d, %3d) start', tileX, tileY);

            worker.postMessage(['.renderTile', renderer,
                {
                    width: width,
                    height: height,
                    tileX: tileX,
                    tileY: tileY,
                    tileW: tileSize,
                    tileH: tileSize,
                    multisample: multisample,
                }]);
        };

        var tileDone = function(tile)
        {
            var id;
            var ctx = canvas.getContext('2d');

            if( ctx.createImageData )
                id = ctx.createImageData(tile.width, tile.height);
            else
                id = ctx.getImageData(0, 0, tile.width, tile.height);

            for( var i=0; i<id.data.length; ++i )
                id.data[i] = tile.data[i];

            /*console.info('tile (%3d, %3d) done: %o; %o',
                    tile.dx, tile.dy, tile, id);*/

            ctx.putImageData(id, tile.dx, tile.dy);
        };

        var response = function(event)
        {
            if( event.data.type == 'tile' )
            {
                renderTile(event.target);
                tileDone(event.data.tile);
            }
            else if( event.data.type == 'console.info' )
            {
                console.info.apply(console, event.data.args);
            }
        };

        var workers = [];
        for( var i=0; i<4; ++i )
        {
            workers[i] = new Worker('stantz/worker.js');
            workers[i].onmessage = response;
            workers[i].onerror =
                function(event)
                {
                    console.info('error: %o', event.data);
                };

            workers[i].postMessage(['.loadScene', sceneJson]);

            renderTile(workers[i]);
        }
    }
));

