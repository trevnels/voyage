let canv, ctx, background, field;
const metric = false;

window.onresize = resizeCanvas;
window.onload = function() {
    canv = document.getElementById('path-canvas');
    ctx = canv.getContext('2d');
    background = document.getElementById('path-background');
    field = document.getElementById('field');

    resizeCanvas()
};


function resizeCanvas(){

    let ratio = field.clientWidth / window.innerHeight;

    if(ratio > 2){
        // fit vertically
        background.width = window.innerHeight * 1.8;
        canv.width = window.innerHeight * 1.8;

        background.height = window.innerHeight * 0.9;
        canv.height = window.innerHeight * 0.9;
    } else {
        // fit horizontally
        background.width = field.clientWidth * 0.9;
        canv.width = field.clientWidth * 0.9;

        background.height = field.clientWidth * 0.45;
        canv.height = field.clientWidth * 0.45;
    }

}

function fieldToPixelCoordinates(x, y, metric){

    let sx = x / 54;
    let sy = y / 27;

    if(metric){
        // convert ft to m
        sx /= 0.3048;
        sy /= 0.3048;
    }

    let px = sx * canv.width;
    let py = sy * canv.height;

    return {x: px, y: py}

}