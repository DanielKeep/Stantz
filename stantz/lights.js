
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
    
    _falloffFns:
    {
        none: function() { return 1.0; },
        linear: function(r, dSq) { return Math.max(0.0, 1.0-(r*r/dSq)); },
        inverse: function(r, dSq) { return r/Math.sqrt(dSq); },
        inverseSquare: function(r, dSq) { return r/dSq; },
    },

    vectorToLightFrom: function(v)
    {
        return (this.localToWorld(stantz.v3.ZERO)).sub(v);
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
    this.falloff = 'inverseSquare';
};

stantz.lights.point.prototype =
{
    __proto__: stantz.light.prototype,
    _aliasName: 'point',

    lightAt: function(i, s)
    {
        var v = i.i;
        var n = i.n;

        var lightPos = this.localToWorld(stantz.v3.ZERO);
        var vToLight = (lightPos).sub(v);
        var lightDistSq = ( vToLight ).magSq();

        var ray = stantz.rayFromTo(v, lightPos);
        var inter = s.castRay(ray, lightDistSq);

        if( inter.obj == null )
        {
            var scale = this._falloffFns[this.falloff](this.radius, lightDistSq);
            var lightColor = (this.color).mulRGB(scale);
            return lightColor;
        }
        else
            return null;
    },
};

/*
 * Directional light.
 */

stantz.lights.directional = function()
{
    this.color = stantz.rgba.WHITE;
    this.direction = stantz.v3(0,-1,0);
};

stantz.lights.directional.prototype =
{
    __proto__: stantz.light.prototype,
    _aliasName: 'directional',

    lightAt: function(i, s)
    {
        var v = i.i;
        var n = i.n;

        /*
        var dirNeg = this.direction.neg();

        var ray = stantz.ray(v, dirNeg);
        var inter = s.castRay(ray);

        if( inter.obj != null )
            return null;
        */

        return this.color;
    },

    vectorToLightFrom: function(v)
    {
        return this.direction.neg();
    },
};

