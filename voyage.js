let canv, ctx, background, field, waypoints;
let waypointList = [];
const metric = false;

window.onresize = resizeCanvas;
window.onload = function() {
    canv = document.getElementById('path-canvas');
    ctx = canv.getContext('2d');

    ctx.strokeStyle = '#ffff00';
    ctx.fillStyle = '#00ff00';

    background = document.getElementById('path-background');
    field = document.getElementById('field');
    waypoints = document.getElementById('waypoints');

    resizeCanvas()
};

function addWaypoint(){
    $(waypoints).append(`<tr><td><input type="number" onkeyup="reindexWaypoints()"></td><td><input type="number" onkeyup="reindexWaypoints()"></td><td><input type="number" onkeyup="reindexWaypoints()"></td></tr>`)
    reindexWaypoints();
}

function reindexWaypoints(){
    waypointList = []
    $(waypoints).find('tr').slice(1).each(function(){
        let fields = $(this).find('input');
        console.log(fields)
        let x = parseFloat(fields[0].value);
        let y = parseFloat(fields[1].value);
        let h = parseFloat(fields[2].value);

        if(isNaN(x) || isNaN(y) || isNaN(h)){
            return
        }
        waypointList.push({x: x, y: y, h: h})
    })
    drawWaypoints()
}

function drawWaypoints(){
    ctx.clearRect(0,0,canv.width, canv.height);
    ctx.strokeStyle = '#ffff00';
    ctx.fillStyle = '#00ff00';
    for(let i = 0; i < waypointList.length - 1; i++){
        plotSpline(createSpline(waypointList[i].x, waypointList[i].y, waypointList[i].h, waypointList[i+1].x, waypointList[i+1].y, waypointList[i+1].h, 1))
    }
    for(let i = 0; i < waypointList.length; i++){
        let coords = fieldToPixelCoordinates(waypointList[i].x, waypointList[i].y, metric);
        ctx.fillRect(Math.floor(coords.x-2),Math.floor(coords.y-2),4,4)
    }
}

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

    drawWaypoints()

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
    let py = (1-sy) * canv.height;

    return {x: px, y: py}

}