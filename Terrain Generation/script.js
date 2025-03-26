var cvs = document.getElementsByTagName('canvas')[0];
var ctx = cvs.getContext('2d');
cvs.imageSmoothingQuality = 'high';

let settings = {
  waterLevel: .2, // Water level, between 0 and 1
  beachLevel: .3, // Beach level, between 0 and 1
  grid: 10, // Size of each pixel
  scale: 1, // Scale of map
}

let rect = cvs.getBoundingClientRect(); //Depixelate
cvs.width = rect.width * devicePixelRatio;
cvs.height = rect.height * devicePixelRatio;
ctx.scale((devicePixelRatio * 10),(devicePixelRatio));
cvs.style.width = '540px';
cvs.style.height = '360px';
cvs.width = 1080;
cvs.height = 720;
cw = cvs.width/settings.grid
ch = cvs.height/settings.grid

function Cell() {
  this.elevation;
  this.y;
  this.x;
  this.drawElevation = function(opacity) {
    ctx.fillStyle = 'hsla(0,0%,' + 100 * (1 - this.elevation + Math.random()/10) + '%,' + opacity + ')'
    if (this.elevation <= settings.waterLevel) {
      ctx.fillStyle = 'hsla(230,100%,' + 100 * (.5 + this.elevation + Math.random()/20) + '%,' + opacity + ')'
    } else if (this.elevation <= settings.beachLevel) {
      ctx.fillStyle = 'hsla(40,100%,' + 100 * (.6 + this.elevation + Math.random()/10) + '%,' + opacity + ')'
    } else {
      ctx.fillStyle = 'hsla(100,50%,' + (25 + 50 * (this.elevation + Math.random()/10)) + '%,' + opacity + ')'
      // if (this.elevation >= settings.beachLevel + 0.05 && Math.floor(Math.random() * 15) == 0) {
      //   ctx.fillStyle = 'hsla(100,100%,30%,' + opacity + ')'
      // }
    }
    ctx.fillRect(this.x*settings.grid , this.y*settings.grid , settings.grid , settings.grid) // fill pixel
  }
}
var map = [];
for (var i = 0;i < ch;i++) {
  map.push([]) // create new column
  for (var j = 0;j < cw;j++) {
    map[i].push(new Cell()) // create new row
  }
}

function noiseGen() {
  var seed = Math.ceil(Math.random() * 65536) 
  noise.seed(seed);
  for (var y = 0; y < ch; y++) {
    for (var x = 0; x < cw; x++) {
      var value = Math.abs(noise.simplex2(settings.scale * x / cw, settings.scale * y / ch));
      value = Math.floor(value * 100)/100 // round to 2 decimal places
      map[y][x].elevation = (value + Math.random()/50) // add slight random variation
      map[y][x].y = y
      map[y][x].x = x
    }
  }
  console.log('Seed: ',seed)
}

function drawGrid() {
  for (var y = 0; y < ch; y++) {
    ctx.strokeStyle = '#63636380'
    ctx.beginPath()
    ctx.moveTo(0,settings.grid*y)
    ctx.lineTo(settings.grid*cw,settings.grid*y)
    ctx.stroke()
  }
  for (var x = 0; x < cw; x++) {
    ctx.beginPath()
    ctx.moveTo(settings.grid*x,0)
    ctx.lineTo(settings.grid*x,settings.grid*ch)
    ctx.stroke()
  }
}
function draw() {
  for (var y = 0; y < ch; y++) { // for each column
    for (var x = 0; x < cw; x++) { // for each row
        map[y][x].drawElevation(1);
    }
  }
}

noiseGen()
draw()