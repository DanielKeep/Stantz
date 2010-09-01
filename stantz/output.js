
stantz.output = {};

stantz.output.canvas = function(canvas)
{
    var ctx = canvas.getContext('2d');

    this.ctx = ctx;
    this.width = parseInt(canvas.width);
    this.height = parseInt(canvas.height);

    this.putPixel = function(x, y, rgba)
    {
        ctx.save();
        ctx.fillStyle = 'rgba(' + (255 * rgba.r)
                + ',' + (255 * rgba.g)
                + ',' + (255 * rgba.b)
                + ',' + (255 * rgba.a)
                + ')';
        ctx.fillRect(x, y, 1, 1);
        ctx.restore();
    };
};

stantz.output.Buffer = function(dx, dy, width, height)
{
    this.width = width;
    this.height = height;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.data = [];
};

stantz.output.Buffer.prototype =
{
    begin: function() {},

    putPixel: function(x, y, rgba)
    {
        var x2 = x - this.dx;
        var y2 = y - this.dy;

        if( x2 < 0 || x2 >= this.width
                || y2 < 0 || y2 >= this.height )
            return;

        var i = 4*(x2 + y2*this.width);
        var data = this.data;

        data[i+0] = Math.round(255*rgba.r);
        data[i+1] = Math.round(255*rgba.g);
        data[i+2] = Math.round(255*rgba.b);
        data[i+3] = Math.round(255*rgba.a);
    },

    finish: function() {},
};

stantz.output.BufferedCanvas = function(canvas)
{
    var _ctx = canvas.getContext('2d');

    this.ctx = _ctx;
    this.width = parseInt(canvas.width);
    this.height = parseInt(canvas.height);
    this.buffer = null;
};

stantz.output.BufferedCanvas.prototype =
{
    begin: function()
    {
        if( this.ctx.createImageData )
            this.buffer = this.ctx.createImageData(this.width, this.height);
        else
            this.buffer = this.ctx.getImageData(0, 0, this.width, this.height);
    },

    putPixel: function(x, y, rgba)
    {
        var i = 4*(x + y*this.width);
        var data = this.buffer.data;
        data[i+0] = 255*rgba.r;
        data[i+1] = 255*rgba.g;
        data[i+2] = 255*rgba.b;
        data[i+3] = 255*rgba.a;
    },

    finish: function()
    {
        this.ctx.putImageData(this.buffer, 0, 0);
        this.buffer = null;
    },
};

