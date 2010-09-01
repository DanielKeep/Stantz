
/*
 * Object prototype.
 */

stantz.object = {};

stantz.object.prototype =
{
    _baseType: 'object',

    transform:  stantz.v3(0,0,0),
    scale:      1.0,

    localToWorld: function(v)
    {
        return (v).add(this.transform);
    },

    localToWorldScale: function(n)
    {
        return n*this.scale;
    },

    toJson: function()
    {
        var json = {type:this._aliasName,value:{}};
        var ignore = /^_/;

        var process = function(dst, src)
        {
            for( var name in src )
            {
                if( ignore.test(name) )
                    continue;

                if( typeof src[name] == "function" )
                    continue;

                if( typeof src[name] == "object" )
                {
                    if( src[name].toJson )
                    {
                        if( ! dst.__baseType ) dst.__baseType = {};

                        dst.__baseType[name] = src[name]._baseType;
                        dst[name] = src[name].toJson();
                    }
                    else
                    {
                        dst[name] = {};
                        process(dst[name], src[name]);
                    }
                }
                else
                    dst[name] = src[name];
            }
        };

        process(json.value, this);

        return json;
    },
};

stantz.object.fromJson = function(json)
{
    var objClass = stantz.objects[json.type];
    var ignore = /^_/;

    var process = function(dst, src)
    {
        for( var name in src )
        {
            if( ignore.test(name) )
                continue;

            if( typeof src[name] == "object" )
            {
                if( src.__baseType && src.__baseType[name] )
                {
                    var baseType = stantz[src.__baseType[name]];
                    dst[name] = baseType.fromJson(src[name]);
                }
                else
                {
                    dst[name] = {};
                    process(dst[name], src[name]);
                }
            }
            else
                dst[name] = src[name];
        }
    };

    var obj = new objClass;
    process(obj, json.value);

    return obj;
};

/*
 * Sphere.
 */

stantz.objects.sphere = function()
{
    this.material = stantz.materials['default'];
};

stantz.objects.sphere.prototype =
{
    __proto__: stantz.object.prototype,
    _aliasName: 'sphere',

    intersectRay: function(ray)
    {
        var vd = ray.vd;
        var vc = this.localToWorld(stantz.v3.ZERO); // center of sphere
        var R = this.localToWorldScale(1.0);        // radius of sphere

        var a = vd.magSq();
        var b = ((vd).mul(2)).dot((ray.v0).sub(vc));
        var c = vc.magSq() + ray.v0.magSq()
            + ((vc).dot(ray.v0))*(-2) - R*R;

        var disc = b*b - 4*a*c;

        if( disc < 0 )
            return null;

        else
        {
            var t = (-b-Math.sqrt(disc))/(2*a);
            var vI = (ray.v0).add((vd).mul(t));
            var vN = ((vI).sub(vc)).unit();
            return {'i':vI,'n':vN};
        }
    },
};

