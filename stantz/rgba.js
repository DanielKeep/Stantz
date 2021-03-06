
stantz.Rgba = function(r,g,b,a)
{
    if( r == UNDEF )
        r = 0.0;
    if( g == UNDEF )
        g = 0.0;
    if( b == UNDEF )
        b = 0.0;
    if( a == UNDEF )
        a = 1.0;

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

stantz.Rgba.prototype =
{
    _baseType: 'rgba',

    dup: function()
    {
        return stantz.rgba(this.r, this.g, this.b, this.a);
    },

    toJson: function()
    {
        return [this.r, this.g, this.b, this.a];
    },

    blendOps:
    {
        add: function(l,r)
        {
            return stantz.rgba(l.r+r.r, l.g+r.g, l.b+r.b, l.a+r.a);
        },

        multiply: function(l,r)
        {
            return stantz.rgba(l.r*r.r, l.g*r.g, l.b*r.b, l.a*r.a);
        },
    },

    blend: function(op, rhs)
    {
        return this.blendOps[op](this, rhs);
    },

    mulRGB: function(rhs)
    {
        return stantz.rgba(this.r*rhs, this.g*rhs, this.b*rhs, this.a);
    },
};

stantz.rgba = function(r,g,b,a) { return new stantz.Rgba(r,g,b,a); };

stantz.rgba.fromJson = function(json)
{
    return stantz.rgba(json[0], json[1], json[2], json[3]);
};

stantz.rgba.averageOf = function(pxs)
{
    if( pxs.length == 1 )
        return pxs[0];

    if( pxs.length == 0 )
        return stantz.rgba.BLACK;

    var rS = 0, gS = 0, bS = 0, aS = 0;

    for( var i=0; i<pxs.length; ++i )
    {
        var px = pxs[i];
        rS += px.r;
        gS += px.g;
        bS += px.b;
        aS += px.a;
    }

    var l = pxs.length;
    return stantz.rgba(rS/l, gS/l, bS/l, aS/l);
};

stantz.rgba.BLACK = stantz.rgba(0,0,0,1);
stantz.rgba.WHITE = stantz.rgba(1,1,1,1);

