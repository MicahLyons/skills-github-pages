const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')
const grid = cvs.width / 64

let settings = {
    fps : 40, // frames per second; influences game speed
    mapScale: 10, // Scale of map relative to screen
    cvsScaleFactor : 5, // Scale of canvas relative to true size
}

cvs.style.width = (4378/settings.cvsScaleFactor + 'px'); //shrink canvas to correct size
cvs.style.height = (2435/settings.cvsScaleFactor + 'px');
const cw = canvas.width
const ch = canvas.height

const map_svg = document.getElementById('map'); //map
const elevation_png = document.getElementById('elevation_map'); //elevation map
const plane_svg = document.getElementById('plane'); //red plane

let map = {
    x : 0, // x pos of NW corner of map relative to NW corner of screen
    y : 0, // y pos of NW corner of map relative to NW corner of screen
    width : cw * settings.mapScale, // width of map
    height : ch * settings.mapScale, // height of map
    lat_zero : ch/2, // Equator
    lon_zero : 2061, // Prime Meridian
    simulate : function() { // calculate position of map based on plane position
        this.x = cw/2 - plane.x;
        this.y = ch/2 - plane.y;
    },
    draw : function() { // draw map
        ctx.drawImage(map_svg,this.x,this.y,this.width,this.height)
        ctx.strokeStyle = '#00000030' // Black
        ctx.lineWidth = 10
        ctx.beginPath();
        ctx.moveTo(this.x + this.lon_zero * settings.mapScale,0);
        ctx.lineTo(this.x + this.lon_zero * settings.mapScale,ch);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,this.y + this.lat_zero * settings.mapScale);
        ctx.lineTo(cw,this.y + this.lat_zero * settings.mapScale);
        ctx.stroke();

        // this.diff_lon = this.width/9/settings.mapScale; // distance between longitude lines
        // this.diff_lon = this.height/9/settings.mapScale;; // distance between longitude lines
        // for (var i = 0; i < 10; i++) {
        //     ctx.beginPath();
        //     ctx.moveTo(this.x + (this.lon_zero + this.diff_lon * i) * settings.mapScale,0);
        //     ctx.lineTo(this.x + (this.lon_zero + this.diff_lon * i) * settings.mapScale,ch);
        //     ctx.stroke();
        // }
    },
}
let plane = {
    x : 23000, // x pos of plane center relative to NW corner of map
    y : 12500, // y pos of plane center relative to NW corner of map
    dx : 0, // change in x
    dy : 0, // change in y
    angle : 0, // angle in radians
    da : [0,0], // change in angle [left,right]
    v : 20, // |velocity|
    simulate: function() { // move plane
        this.angle += this.da[1] - this.da[0] // change angle by difference between left and right da
        this.dx = this.v * Math.cos(this.angle) // change dx by resolving velocity vector
        this.dy = this.v * Math.sin(this.angle) // change dy by resolving velocity vector
        this.x += this.dx // add dx to x pos
        this.y += this.dy // add dy to y pos
    },
    draw: function() { // draw plane
        trail.push(new trailParticle())
        for (var i = 0; i < trail.length; i++) { // For each particle in trail
            if (trail[i].time >= 10) { // Draw particle only if it has beed 1s or more
                trail[i].draw()
            }
            trail[i].time++
        }
        drawImageRotated(plane_svg,cw/2,ch/2,this.angle)
    },
}

let trail = [];
function trailParticle() {
    this.x = plane.x //- 150 * Math.cos(plane.angle); // x pos center relative to NW corner of map
    this.y = plane.y //- 150 * Math.sin(plane.angle);; // y pos center relative to NW corner of map
    this.alpha = .75; // Opacity
    this.time = 0 // Frames since particle was created
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(map.x + this.x, map.y + this.y, 20, 0, 2*Math.PI); // Draw circle at plane center
        ctx.fillStyle = 'rgba(100%,100%,100%,' + this.alpha + ')'; // White
        ctx.fill();
        this.alpha -= .025; // Decrease opacity each frame
        if (this.alpha <= 0) {
            trail.splice(this,1); // Delete particle once it disappears
        }
    }
}
function drawImageRotated(image,centerx,centery,angle) { // Rotate image aroun its center point
    var width = image.width
    var height = image.height
    
    ctx.translate(centerx, centery);
    ctx.rotate(angle);
    ctx.drawImage(image, -width / 2, -height / 2, width, height); 
    ctx.rotate(-angle);
    ctx.translate(-centerx, -centery);
}

let mouse = {
    x : 0,
    y : 0,
    drawLines : function() {
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 3
        ctx.beginPath();
        ctx.moveTo(this.x,0);
        ctx.lineTo(this.x,ch);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,this.y)
        ctx.lineTo(cw,this.y);
        ctx.stroke();
    }
}
function getCursorPos(canvas,event) {
    var cvsRect = canvas.getBoundingClientRect();
    mouse.x = settings.cvsScaleFactor * (event.clientX - cvsRect.left);
    mouse.y = settings.cvsScaleFactor * (event.clientY - cvsRect.top);
}

setInterval(function() { // Game loop; runs every frame
    ctx.clearRect(0,0,cw,ch);
    map.simulate();
    map.draw();
    plane.simulate();
    plane.draw();
    // mouse.drawLines();
},(1000 / settings.fps));

document.addEventListener('keydown',function(e) {
    if (e.key == 'a') {
        plane.da[0] = plane.v/400 // steer left
    }
    if (e.key == 'd') {
        plane.da[1] = plane.v/400 // steer right
    }
    if (e.key == 'w') {
        plane.v = 30 // Boost
    }
})
document.addEventListener('keyup',function(e) {
    if (e.key == 'a') {
        plane.da[0] = 0 // stop steering left
    }
    if (e.key == 'd') {
        plane.da[1] = 0 // stop steering right
    }
    if (e.key == 'w') {
        plane.v = 20 // Stop Boost
    }
})
cvs.addEventListener("mousemove", function (e) {
    getCursorPos(cvs, e);
});
cvs.addEventListener("mousedown", function (e) {
    console.log('x:',mouse.x)
    console.log('y:',mouse.y)
});