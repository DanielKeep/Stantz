
stantz.Scene = function()
{
    var rgba = stantz.rgba;
    var v3 = stantz.v3;

    this.imports = {};
    this.background = stantz.rgba(0,0,0);
    this.camera =
    {
        center:     v3(0,0,-3),
        forward:    v3(0,0,1),
        right:      v3(1,0,0),
        up:         v3(0,1,0),
        fov:        90,
        zNear:      1.0,
    };
    this.objects = [];
};

stantz.Scene.prototype =
{
    toJson: function()
    {
        var json =
        {
            imports: {},
            background: null,
            camera: {},
            objects: [],
        };

        var copyObj = function(to, from)
        {
            for( var key in from )
                to[key] = from[key];
        };

        copyObj(json.imports, this.imports);
        json.background = this.background.toJson();
        copyObj(json.camera,
            {
                center: this.camera.center.toJson(),
                forward: this.camera.forward.toJson(),
                right: this.camera.right.toJson(),
                up: this.camera.up.toJson(),
                fov: this.camera.fov,
                zNear: this.camera.zNear,
            });

        for( var i=0; i<this.objects.length; ++i )
        {
            json.objects[i] =
            {
                baseType: this.objects[i]._baseType,
                json: this.objects[i].toJson(),
            };
        }

        return json;
    },
};

stantz.Scene.fromJson = function(json)
{
    var scene = new stantz.Scene;
    var rgba = stantz.rgba;
    var v3 = stantz.v3;

    var copyObj = function(to, from)
    {
        for( var key in from )
            to[key] = from[key];
    };

    copyObj(scene.imports, json.imports);
    scene.background = rgba.fromJson(json.background);
    copyObj(scene.camera,
        {
            center: v3.fromJson(json.camera.center),
            forward: v3.fromJson(json.camera.forward),
            right: v3.fromJson(json.camera.right),
            up: v3.fromJson(json.camera.up),
            fov: json.camera.fov,
            zNear: json.camera.zNear,
        });

    for( var i=0; i<json.objects.length; ++i )
    {
        var baseType = json.objects[i].baseType;
        scene.objects[i] = stantz[baseType].fromJson(json.objects[i].json);
    }

    return scene;
};

