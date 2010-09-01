
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
    var diffuse = stantz.materials.diffuse;
    var coordGrid = stantz.materials.coordGrid;
    var point = stantz.lights.point;

    scene = new stantz.Scene;

    scene.objects =
    [
        //*
        mkObj(new point(),
        {
            transform:  v3(0,3,0),
            radius:     5.0,
            color:      rgba(1,0,0),
        }),
        // */
        /*
        mkObj(new stantz.lights.directional(),
        {
            direction:  v3(0,-1,0),
            color:      rgba(1,0,0),
        }),
        // */
        mkObj(new point(),
        {
            transform:  v3(0,-1,0),
            radius:     1.0,
            color:      rgba(0,0,1),
        }),
        //*
        mkObj(new sphere(),
        {
            transform:  v3(0,0,0),
            scale:      1.0,
            radius:     0.25,
            //material:   new solid(rgba(0,1,0)),
            material:   new normal,
        }),
        // */
        mkObj(new sphere(),
        {
            transform:  v3(-1,1,1),
            scale:      1.0,
            material:   new diffuse(rgba(1,1,1)),
        }),
        mkObj(new sphere(),
        {
            transform:  v3(1,-1,-1),
            scale:      1.0,
            radius:     0.5,
            material:   new coordGrid(4),
        }),

        mkObj(new stantz.objects.plane(),
        {
            transform:  v3(0,-1.5,0),
            normal:     v3(0,1,0),
            material:   new diffuse(rgba.WHITE), //new coordGrid(),
        }),
        /*
        mkObj(new stantz.objects.plane(),
        {
            transform:  v3(0,0,5),
            normal:     v3(0,1,-1).unit(),
            material:   new diffuse(rgba.WHITE), //new coordGrid(),
        }),
        */
    ];

    scene = stantz.Scene.fromJson(scene.toJson());
}

stantz.onImportsComplete(setScene);

