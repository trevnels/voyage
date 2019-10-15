let canv, ctx, background, field, waypoints;
let waypointList = [];
let draggedIndex = -1;

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

    resizeCanvas();

    canv.onmousedown = function(e){
        // calculate which point, if any, to drag
        let coords = pixelToFieldCoordinates(e.offsetX, e.offsetY, metric)

        let shortest = -1;

        for(let i = 0; i < waypointList.length; i++){

            let x = waypointList[i].x;
            let y = waypointList[i].y;

            let dist = Math.hypot(x-coords.x, y-coords.y);
            let min = (metric) ? 0.6048 : 1;

            console.log(dist <= min);

            if(dist <= min && (shortest === -1 || dist < shortest)){
                shortest = dist;
                draggedIndex = i
            }

        }

        console.log(draggedIndex);
    }

    canv.onmouseup = function(){
        console.log('stopped dragging');
        draggedIndex = -1;
    }

    canv.onmousemove = function(e){

        if(draggedIndex >= 0){
            let newCoords = pixelToFieldCoordinates(e.offsetX, e.offsetY, metric)
            let wp = $(waypoints).find('tr').slice(1)[draggedIndex]
            let fields = $(wp).find('input');

            fields[0].value = Math.round(newCoords.x*100)/100;
            fields[1].value = Math.round(newCoords.y*100)/100;

            reindexWaypoints()
        }

    }
};

function addWaypoint(){
    $(waypoints).append(`<tr><td><input type="number" onkeyup="reindexWaypoints()" value="${Math.random()*54}"></td><td><input type="number" onkeyup="reindexWaypoints()" value="${Math.random()*27}"></td><td><input type="number" onkeyup="reindexWaypoints()" value="0"></td></tr>`)
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
    ctx.lineWidth = 4;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    for(let i = 0; i < waypointList.length - 1; i++){
        plotSpline(createSpline(waypointList[i].x, waypointList[i].y, waypointList[i].h, waypointList[i+1].x, waypointList[i+1].y, waypointList[i+1].h, 1), i === 0)
    }
    if(waypointList.length > 1){
        let endCoords = fieldToPixelCoordinates(waypointList[waypointList.length-1].x,waypointList[waypointList.length-1].y,metric);
        ctx.lineTo(endCoords.x, endCoords.y);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 8;
    for(let i = 0; i < waypointList.length; i++){
        let coords = fieldToPixelCoordinates(waypointList[i].x, waypointList[i].y, metric);
        ctx.fillRect(coords.x-4,coords.y-4,8,8)
    }
}

function resizeCanvas(){

    let ratio = field.clientWidth / window.innerHeight;

    if(ratio > 2){
        // fit vertically
        background.width = window.innerHeight * 1.8;
        canv.width = window.innerHeight * 1.8 * 2;

        background.height = window.innerHeight * 0.9;
        canv.height = window.innerHeight * 0.9 * 2;
    } else {
        // fit horizontally
        background.width = field.clientWidth * 0.9;
        canv.width = field.clientWidth * 0.9 * 2;

        background.height = field.clientWidth * 0.45;
        canv.height = field.clientWidth * 0.45 * 2;
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

function pixelToFieldCoordinates(x,y,metric){

    let sx = x / canv.width;
    let sy = 1-(y / canv.height);

    sx *= 54;
    sy *= 27;

    if(metric){
        // convert ft to m
        sx *= 0.3048;
        sy *= 0.3048;
    }

    return {x: sx, y: sy}
}
