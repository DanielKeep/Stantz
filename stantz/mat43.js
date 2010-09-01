
stantz.Mat43 = function(m, noCopy)
{
    if( m == UNDEF )
        this.elems = stantz.Mat43.IDENTITY_ELEMS.slice(0);
    else
        this.elems = noCopy ? m : m.slice(0);
};

stantz.Mat43.IDENTITY_ELEMS = [1,0,0,0,
                               0,1,0,0,
                               0,0,1,0];

stantz.Mat43.prototype =
{
    _baseType: 'mat43',

    MISSING_ROW: [0,0,0,1],

    dup: function()
    {
        return stantz.mat43(this.elems);
    },

    toJson: function()
    {
        return this.buffer;
    },

    mul: function(rhs)
    {
        if( typeof rhs == "number" )
        {
            var r = this.elems.slice(0);
            for( var i=0; i<r.length; ++i )
                r[i] *= rhs;
            return stantz.mat43(r, true);
        }
        else
        {
            var r = this.elems.slice(0);

            for( var j=0; j<3; ++j )
            for( var i=0; i<4; ++i )
            {
                var e = 0.0;
                for( var k=0; k<3; ++k )
                    e += this.elems[k+j*4] * rhs.elems[i+k*4];
                e += this.elems[3+j*4] * this.MISSING_ROW[i];

                r[i+j*4] = e;
            }

            return stantz.mat43(r, true);
        }
    },
};

stantz.mat43 = function(m) { return new stantz.Mat43(m); };

stantz.mat43.fromJson = function(json)
{
    return stantz.mat43(json);
};

stantz.mat43.IDENTITY = stantz.mat43();

stantz.mat43.rotateAround = function(v, angle)
{
    v = v.unit();

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;
    var vxx = vx*vx;
    var vyy = vy*vy;
    var vzz = vz*vz;
    var vxy = vx*vy;
    var vxz = vx*vz;
    var vyz = vy*vz;

    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return stantz.mat43(
        [   vxx+(1-vxx)*c,  vxy*(1-c)-vz*s, vxz*(1-c)+vy*s, 0,
            vxy*(1-c)+vz*s, vyy+(1-vyy)*c,  vyz*(1-c)-vx*s, 0,
            vxz*(1-c)-vy*s, vyz*(1-c)+vx*s, vzz+(1-vzz)*c,  0   ]);
};

