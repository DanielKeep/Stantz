
stantz.V3 = function(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
};

stantz.V3.prototype =
{
    _baseType: 'v3',

    dup: function()
    {
        return stantz.v3(this.x, this.y, this.z);
    },

    toJson: function()
    {
        return [this.x, this.y, this.z];
    },

    mag: function()
    {
        return Math.sqrt(this.magSq());
    },

    magSq: function()
    {
        return this.x*this.x + this.y*this.y + this.z*this.z;
    },

    unit: function()
    {
        return (this.dup()).div(this.mag());
    },

    neg: function()
    {
        return stantz.v3(-this.x, -this.y, -this.z);
    },

    add: function(rhs)
    {
        return stantz.v3(this.x+rhs.x, this.y+rhs.y, this.z+rhs.z);
    },

    sub: function(rhs)
    {
        return stantz.v3(this.x-rhs.x, this.y-rhs.y, this.z-rhs.z);
    },

    mul: function(rhs)
    {
        if( typeof rhs == 'number' )
            return stantz.v3(rhs*this.x, rhs*this.y, rhs*this.z);

        else
            throw "Cannot multiply 'v3' and '"+(typeof rhs)+"'";
    },

    div: function(rhs)
    {
        if( typeof rhs == 'number' )
            return stantz.v3(this.x/rhs, this.y/rhs, this.z/rhs);

        else
            throw "Cannot divide 'v3' and '"+(typeof rhs)+"'";
    },

    dot: function(rhs)
    {
        return this.x*rhs.x + this.y*rhs.y + this.z*rhs.z;
    },
};

stantz.v3 = function(x,y,z) { return new stantz.V3(x,y,z); };

stantz.v3.fromJson = function(json)
{
    return stantz.v3(json[0], json[1], json[2]);
};

stantz.v3.ZERO = stantz.v3(0,0,0);
stantz.v3.X = stantz.v3(1,0,0);
stantz.v3.Y = stantz.v3(0,1,0);
stantz.v3.Z = stantz.v3(0,0,1);

