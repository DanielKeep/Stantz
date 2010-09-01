
var buffer;

$(document).ready(
stantz.onImportsComplete
(
    function()
    {
        console.info('Running document script (simple)');

        var canvas = $('#output')[0];
        console.info('Canvas is: %o', canvas);
        console.info('Scene is:  %o', scene);

        var output = new stantz.output.BufferedCanvas(canvas);
        var renderer = stantz.renderers.raytrace;

        output.begin();
        renderer.render(scene, output, {multisample:4});
        output.finish();

        buffer = output;
    }
));

