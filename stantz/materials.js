
/*
 * Material prototype.
 */

stantz.material = {};

stantz.material.prototype =
{
    _baseType: 'material',

    shade: function(args)
    {
        return stantz.rgba.BLACK;
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

stantz.material.fromJson = function(json)
{
    var matClass = stantz.materials[json.type];
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

    var obj = new matClass;
    process(obj, json.value);

    return obj;
};

/*
 * Default material.
 */

stantz.materials['default'] = function()
{
};

stantz.materials['default'].prototype =
{
    __proto__: stantz.material.prototype,
    _aliasName: 'default',

    shade: function(args)
    {
        return stantz.rgba.BLACK;
    },
};

stantz.materials['default'].INSTANCE = new stantz.materials['default']();

/*
 * Solid material (no shading).
 */

stantz.materials.solid = function(color)
{
    this.color = color;
};

stantz.materials.solid.prototype =
{
    __proto__: stantz.material.prototype,
    _aliasName: 'solid',

    shade: function(i, s)
    {
        return this.color;
    },
};

/*
 * Diffuse material.
 */

stantz.materials.diffuse = function(color)
{
    this.color = color;
};

stantz.materials.diffuse.prototype =
{
    __proto__: stantz.material.prototype,
    _aliasName: 'diffuse',

    shade: function(i, s)
    {
        var lightSum = stantz.rgba.BLACK;

        for( var j=0; j<s.lights.length; ++j )
        {
            var light = s.lights[j];
            var lightPos = light.localToWorld(stantz.v3.ZERO);
            var lightDistSq = ( (lightPos).sub(i.i) ).magSq();
            
            var ray = stantz.rayFromTo(i.i, lightPos);
            var inter = s.castRay(ray, lightDistSq);

            if( inter.obj == null )
            {
                var scale = 1/lightDistSq;
                var lightColor = (light.color).mulRGB(scale);
                lightSum = (lightSum).blend('add', lightColor);
            }
        }

        var color = (lightSum).blend('multiply', this.color);

        return color;
    },
}

/*
 * Normal material.
 */

stantz.materials.normal = function()
{
};

stantz.materials.normal.prototype =
{
    __proto__: stantz.material.prototype,
    _aliasName: 'normal',

    shade: function(i)
    {
        var vN = i.n;
        return stantz.rgba(
                0.5+vN.x/2,
                0.5+vN.y/2,
                0.5+vN.z/2);
    },
};

/*
 * Coordinate grid material.
 */

stantz.materials.coordGrid = function(scale)
{
    this.scale = scale || 1.0;
};

stantz.materials.coordGrid.prototype =
{
    __proto__: stantz.material.prototype,
    _aliasName: 'coordGrid',

    shade: function(i, s)
    {
        var vI = i.i;
        var mod = function(x,y) { return x - y * Math.floor(x/y); };

        return stantz.rgba(
                mod(vI.x * this.scale, 1.0),
                mod(vI.y * this.scale, 1.0),
                mod(vI.z * this.scale, 1.0));
    },
};

