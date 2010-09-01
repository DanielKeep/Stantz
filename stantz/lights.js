
/*
 * Light prototype.
 */

stantz.light = {};

stantz.light.prototype =
{
    _baseType: 'light',

    transform:  stantz.v3(0,0,0),

    localToWorld: function(v)
    {
        return (v).add(this.transform);
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

stantz.light.fromJson = function(json)
{
    var lightClass = stantz.lights[json.type];
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

    var obj = new lightClass;
    process(obj, json.value);

    return obj;
};

/*
 * Point light.
 */

stantz.lights.point = function()
{
    this.color = stantz.rgba.WHITE;
    this.radius = 1.0;
}

stantz.lights.point.prototype =
{
    __proto__: stantz.light.prototype,
    _aliasName: 'point',
};

