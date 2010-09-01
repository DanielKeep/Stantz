
stantz.renderers.raytrace =
{
    render: function(scene, output, params)
    {
        params =
        {
            width: params.width || output.width,
            height: params.height || output.height,
            tileX: params.tileX || 0,
            tileY: params.tileY || 0,
            tileW: params.tileW || output.width,
            tileH: params.tileH || output.height,
            multisample: params.multisample || 1,
        };

        // Cast rays
        var cam = scene.camera;

        var camCenter = cam.center;
        var camForward = cam.forward.unit();
        var camRight = cam.right.unit();
        var camLeft = camRight.neg();
        var camUp = cam.up.unit();

        /*
        console.info("cF: %o, cR: %o, cU: %o", camForward, camRight, camUp);
        console.info("cL: %o", camLeft);
        */

        // figure out camera vectors
        var fovRad = (Math.PI*cam.fov/180) / 2;
        var vMid = (camForward).mul(cam.zNear);
        var fovH = fovRad;
        var fovV = fovRad/params.width*params.height;

        /*
        console.info("fovRad: %o (%o π)", fovRad, fovRad/Math.PI);
        console.info("fovH: %o, fovV: %o", fovH, fovV);
        console.info("vMid: %o", vMid);
        */

        var vLDir = ( ( (camForward).mul(Math.cos(fovH)) )
                .add( (camLeft).mul(Math.sin(fovH)) ) ).unit();

        var vTDir = ( ( (camForward).mul(Math.cos(fovV)) )
                .add( (camUp).mul(Math.sin(fovV)) ) ).unit();

        /*
        console.info("vLDir: %o, vTDir: %o", vLDir, vTDir);
        */

        var vLMag = (vMid).dot(vLDir);
        var vTMag = (vMid).dot(vTDir);

        var vL = (vLDir).div(vLMag);
        var vT = (vTDir).div(vTMag);

        /*
        console.info("vL: %o, vT: %o", vL, vT);
        */

        var vH = (camRight).mul( (vL).dot(camLeft) ).mul(2);
        var vV = ((camUp).mul( (vT).dot(camUp) )).neg().mul(2);

        /*
        console.info("vH: %o", vH);
        console.info("vV: %o", vV);
        */

        var vTL = ( (vMid).sub(vH.div(2)) ).sub(vV.div(2)).add(camCenter);

        /*
        console.info("vTL: %o", vTL);
        */

        var vHPp = vH.div(params.width);
        var vVPp = vV.div(params.height);

        // TODO: transform and scale all objects

        // build list of objects and lights
        var objs = [];
        var lights = [];

        for( var i=0; i<scene.objects.length; ++i )
        {
            var obj = scene.objects[i];

            if( obj._baseType == 'object' )
                objs[objs.length] = obj;

            else if( obj._baseType == 'light' )
                lights[lights.length] = obj;

            else
                throw "unknown object type '"+obj._baseType+"'";
        }

        // raycast pixels

        var vPOff;

        if( params.multisample >= 4 )
            vPOff =
            [
                (vHPp.mul(-0.25)).add(vVPp.mul(-0.25)),
                (vHPp.mul( 0.25)).add(vVPp.mul(-0.25)),
                (vHPp.mul(-0.25)).add(vVPp.mul( 0.25)),
                (vHPp.mul( 0.25)).add(vVPp.mul( 0.25)),
            ];

        else
            vPOff = [stantz.v3.ZERO];

        var tileX = params.tileX;
        var tileY = params.tileY;
        var tileW = params.tileW;
        var tileH = params.tileH;
        
        var castRay = function(ray, limitSq)
        {
            if( limitSq == UNDEF )
                limitSq = (1.0/0.0);

            var iObj = null, iDist = limitSq, iInfo;

            for( var i=0; i<objs.length; ++i )
            {
                var obj = objs[i];
                var iTmp = obj.intersectRay(ray);

                if( iTmp != null )
                {
                    var dist = ( (iTmp.i).sub(camCenter) ).magSq();
                    if( dist < iDist )
                    {
                        iObj = obj;
                        iDist = dist;
                        iInfo = iTmp;
                    }
                }
            }

            return {'obj':iObj, 'dist':iDist, 'info':iInfo};
        };

        var sceneObjs = {'objects':objs,'lights':lights,'castRay':castRay};

        for( var y=tileY; y<tileY+tileH; ++y )
        for( var x=tileX; x<tileX+tileW;  ++x )
        {
            var vPBase = (vTL).add(vHPp.mul(x)).add(vVPp.mul(y));
            var px = [];

            for( var z=0; z<vPOff.length; ++z )
            {
                var vP = vPBase.add(vPOff[z]);
                var ray = stantz.rayFromTo(camCenter, vP);

                var inter = castRay(ray);

                if( inter.obj == null )
                    px[z] = scene.background;

                else
                    px[z] = inter.obj.material.shade(inter.info, sceneObjs);
            }

            var pxAvg = stantz.rgba.averageOf(px);
            output.putPixel(x, y, pxAvg);
        }
    },
};

