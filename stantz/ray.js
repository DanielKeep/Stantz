
stantz.Ray = function(v0,vd)
{
    this.v0 = v0;
    this.vd = vd;
};

stantz.Ray.prototype =
{
    dup: function()
    {
        return new stantz.Ray(this.v0, this.vd);
    },
};

stantz.ray = function(v0,vd) { return new stantz.Ray(v0,vd); };

stantz.rayFromTo = function(v0,v1)
{
    return stantz.ray(v0, (v1).sub(v0));
};

