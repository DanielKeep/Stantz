
var scene;

function setScene()
{
    console.info('scene loaded');

    var rgba = stantz.rgba;
    var v3 = stantz.v3;

    var mkObj = stantz.mkObj;
    var sphere = stantz.objects.sphere;
    var solid = stantz.materials.solid;
    var normal = stantz.materials.normal;

    scene = new stantz.Scene;

    scene.objects =
    [
        mkObj(new sphere(),
        {
            transform:  v3(0,0,0),
            scale:      1.0,
            //material:   new solid(rgba(0,1,0)),
            material:   new normal,
        }),
        mkObj(new sphere(),
        {
            transform:  v3(-1,1,1),
            scale:      1.0,
            material:   new solid(rgba(1,0,0)),
        }),
        mkObj(new sphere(),
        {
            transform:  v3(1,-1,-1),
            scale:      1.0,
            material:   new solid(rgba(0,0,1)),
        }),
    ];

    scene = stantz.Scene.fromJson(scene.toJson());
}

stantz.onImportsComplete(setScene);

