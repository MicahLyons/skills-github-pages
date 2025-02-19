let cvs = document.getElementById('background');
let ctx = cvs.getContext('2d')

cvs.width = window.innerWidth; // adjust canvas proportions
cvs.height = window.innerHeight;
cvs.style.width = '100vw'; //shrink canvas to correct size
cvs.style.height = '100vh';
const cw = cvs.width
const ch = cvs.height

const settings = {
    fps: 40,
    count: 200, // number of particles
    minRadius: 100, // minimum radius from center
}

let hue = 0 // hue of particles and borders
let particles = [];
function Particle() {
    this.r = settings.minRadius + Math.random() * (cw - settings.minRadius)/2 // radius from center
    this.angle = Math.random() * 2 * Math.PI; // angle in radians
    this.da = .001 + Math.random() * .001; // angular velocity in radians/frame
    this.draw = function() {
        this.angle += this.da; // increase angle by angular velocity
        
        this.x = (cw/2) + this.r * Math.cos(this.angle); // translate polar coordinates to cartesian x
        this.y = (ch/2) + this.r * Math.sin(this.angle); // translate polar coordinates to cartesian y
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2*Math.PI);
        ctx.fillStyle = 'hsl('+hue+',100%,50%)';
        ctx.fill();
    }
}

for (var i = 0; i < settings.count; i++) {
    particles.push(new Particle()) // create particles
}

function loop() { // run this each frame
    ctx.fillStyle = '#00000004';
    ctx.fillRect(0,0,cw,ch);
    hue += .1;
    if (this.hue >= 360) {this.hue = 0;}
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
    {
        document.getElementById('titleBlock').style.border = '2px solid hsl('+hue+',100%,50%)';
        document.getElementById('links').style.border = '2px solid hsl('+hue+',100%,50%)';
        var buttons = document.querySelectorAll('.redirect');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.border = '1px solid hsl('+hue+',100%,50%)'
        }
    }
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

