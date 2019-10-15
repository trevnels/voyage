let coeffs
function createSpline(x0, y0, h0, x1, y1, h1, curvaturePower){

    curvaturePower = Math.sqrt((x0-x1)**2 + (y0-y1)**2);
    let c = math.matrix([[0,0,0,1],[1,1,1,1],[0,0,1,0],[3,2,1,0]]);
    let inputs = math.matrix([[x0,y0],[x1,y1],[Math.cos(h0) * curvaturePower,Math.sin(h0) * curvaturePower],[Math.cos(h1) * curvaturePower,Math.sin(h1) * curvaturePower]]);

    let ci = math.inv(c);

    console.log(inputs);
    console.log(ci);

    coeffs = math.multiply(ci, inputs);
    console.log(coeffs)
    let coeffobj = {
        x: {
            a: coeffs.subset(math.index(0,0)),
            b: coeffs.subset(math.index(1,0)),
            c: coeffs.subset(math.index(2,0)),
            d: coeffs.subset(math.index(3,0)),
        },
        y: {
            a: coeffs.subset(math.index(0,1)),
            b: coeffs.subset(math.index(1,1)),
            c: coeffs.subset(math.index(2,1)),
            d: coeffs.subset(math.index(3,1)),
        },
    };
   return coeffobj;
}

function plotSpline(coeffobj){

    ctx.beginPath();

    let coords = fieldToPixelCoordinates(evaluatePoly(coeffobj.x, 0), evaluatePoly(coeffobj.y, 0), metric);
    ctx.moveTo(coords.x, coords.y);
    for(let t = 0; t <= 1; t += 0.01){

        coords = fieldToPixelCoordinates(evaluatePoly(coeffobj.x, t), evaluatePoly(coeffobj.y, t), metric);
        ctx.lineTo(coords.x, coords.y);
        console.log(coords)

    }

    ctx.stroke();
    ctx.closePath();

}

function evaluatePoly(coeffs, t){
    return coeffs.a * (t**3) + coeffs.b * (t**2) + coeffs.c * t + coeffs.d;
}