
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

    shade: function(args)
    {
        return this.color;
    },
};

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

    shade: function(args)
    {
        var vN = args.n;
        return stantz.rgba(
                0.5+vN.x/2,
                0.5+vN.y/2,
                0.5+vN.z/2);
    },
};

