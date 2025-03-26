// to do: 
// add more comments
// scale player and enemy and ray better
// better asteroid movement

let cvs = document.getElementById('cvs')
let ctx = cvs.getContext('2d')

cvs.width = window.innerWidth*5;
cvs.height = window.innerHeight*5;
cw = cvs.width;
ch = cvs.height;

// var xml = new XMLSerializer().serializeToString(document.getElementById('planetSVG'));
// console.log(xml)

let laser = new Audio('https://od.lk/s/OThfMzc0NDAyMTRf/laserShoot.wav');
let kaboom = new Audio('https://od.lk/s/OThfMzc0NDAyMTNf/explosion.wav');
let kaboom2 = new Audio('https://od.lk/s/OThfMzc0NDAyMjJf/explosion%20%281%29.wav')
let music = new Audio('Assets/music.mp3')

const playerIcon = document.getElementById('playerIcon');
const playerGrad = document.getElementById('gradGreen'); // player background gradient
    // playerIcon.width = cw/50;
    // playerIcon.height = playerIcon.width;
const enemyIcon = document.getElementById('enemyIcon');
const enemyGrad = document.getElementById('gradRed'); // enemy background gradient
    // enemyIcon.width = cw/60;
    // enemyIcon.height = enemyIcon.width;
let gameRunning = true

let player = {
    x: cw/2, // x position of player center relative to left of canvas
    y: ch/2, // y position of player center relative to top of canvas
    dx: 0, // rate of change of x
    dy: 0, // rate of change of y
    angle: 0, // angle of player, rotates clockwise
    cooldown: 0, // time until laser can fire
    score: 0, // number of enemies killed
    combo: 0, // number of enemies killed in last hit
    largestCombo: 0, // largest number of enemies killed in one hit
    draw: function() {
        this.cooldown += -1 // decrease laser cooldown timer

        if (this.x > cw) { // if player leaves the screen, place on opposite side
            this.x = 0;
        } if (this.x < 0) {
            this.x = cw;
        } if (this.y > ch) {
            this.y = 0;
        } if (this.y < 0) {
            this.y = ch;
        }
        if (this.dx < -.1 || this.dx > 0.1)  { // slow down player
            this.dx *= .95;
        } if (this.dy < -.1 || this.dy > .1) {
            this.dy *= .95;
        }

        this.x += this.dx; // move player in x direction
        this.y += this.dy; // moxe player in y direction

        this.angle = Math.atan2((mouse.y - this.y) , (mouse.x - this.x)) // rotate player to face cursor

        drawImageRotated(playerGrad,this.x,this.y,0);
        drawImageRotated(playerIcon,this.x,this.y,this.angle);
    }
}
let enemies = []; // array containing all enemies
function Enemy() {
    this.spawnAngle = Math.random() * 2 * Math.PI; // angle of enemy spawnpoint
    this.x = cw/2 + (50 + Math.sqrt(cw**2 + ch**2)) * Math.cos(this.spawnAngle); // x pos
    this.y = ch/2 + (50 + Math.sqrt(cw**2 + ch**2)) * Math.sin(this.spawnAngle); // y pos
    this.v = 7 + Math.random() * 6; // forward velocity
    this.angle = Math.atan2((this.y - player.y) , (this.x - player.x)); // angle; turns towards player
    this.da = 0.01 + Math.random() * .02; // change in angle
    this.targetAngle = 0; // angle to player
    this.explosionTimer = 0;
    this.draw = function() {
        if (this.explosionTimer == 0) { // if enemy is alive
            this.targetAngle = Math.atan2((this.y - player.y) , (this.x - player.x)) // recalculate angle to player
            if (this.targetAngle < 0) { // make angle positive
                this.targetAngle += Math.PI * 2;
            } if (this.angle > Math.PI * 2) {
                this.angle = 0;
            } if (this.angle < 0) {
                this.angle = Math.PI * 2;
            }
            if (this.angle < this.targetAngle && Math.abs(this.angle - this.targetAngle) < Math.PI) { // turn toward player
                this.angle += this.da;
            } if (this.angle > this.targetAngle && Math.abs(this.angle - this.targetAngle) < Math.PI) {
                this.angle -= this.da;
            } if (this.angle < this.targetAngle && Math.abs(this.angle - this.targetAngle) > Math.PI) {
                this.angle -= this.da;
            } if (this.angle > this.targetAngle && Math.abs(this.angle - this.targetAngle) > Math.PI) {
                this.angle += this.da;
            }
            
            this.x += -this.v * Math.cos(this.angle); // resolve velocity vector into x and y components
            this.y += -this.v * Math.sin(this.angle);
            drawImageRotated(enemyGrad,this.x,this.y,0);
            drawImageRotated(enemyIcon,this.x,this.y,this.angle);

            if ((Math.abs(this.x - player.x) <= .5*(playerIcon.width+enemyIcon.width)) && (Math.abs(this.y - player.y) <= .5*(playerIcon.width+enemyIcon.width))) {
                console.log('game over')
                kaboom2.play();
                gameRunning = false // end game
            }
        } else {
            for (var i = 0; i < 15; i++) {
                var expRadius = Math.random() * 100; // particle radius from explosion center
                var expAngle = Math.random() * 2 * Math.PI; // particle angle from explosion center
                var expWidth = Math.random() * 20 + 5 // size of explosion particle
                var expX = this.x + expRadius * Math.cos(expAngle); // x pos of explosion paticle
                var expY = this.y + expRadius * Math.sin(expAngle); // y pos of explostion particle
                ctx.fillStyle = 'hsl('+Math.random()*50+',100%,50%)'; // red to yellow
                ctx.fillRect(expX-expWidth/2,expY-expWidth/2,expWidth,expWidth);
            }
            this.explosionTimer += .5;
        }
    }
    this.explode = function() {
        player.score += 1; // increment score
        player.combo += 1; // increment combo; resets each frame
        this.explosionTimer = 1; // start exploding
        kaboom = new Audio('https://od.lk/s/OThfMzc0NDAyMTNf/explosion.wav');
        kaboom.play(); // play explosion sound
    }
}
function drawImageRotated(image,centerx,centery,angle) { // Rotate image around its center point
    var width = image.width
    var height = image.height
    
    ctx.translate(centerx, centery);
    ctx.rotate(angle);
    ctx.drawImage(image, -width / 2, -height / 2, width, height); 
    ctx.rotate(-angle);
    ctx.translate(-centerx, -centery);
}
background = [];
function Star() {
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.opacity = Math.random();
    this.r = Math.random() * 8 + 4;
    this.draw = function() {
        this.x += -2
        ctx.beginPath();
        ctx.fillRect(this.x,this.y,this.r,this.r)
        ctx.fillStyle = 'rgba(100%,100%,100%,'+this.opacity+')';
        ctx.fill();
        this.opacity += -0.001

        if (this.opacity <= 0) {
            this.x = Math.random() * cw;
            this.y = Math.random() * ch;
            this.opacity = 1;
        }
    }
}
function Planet() {
    this.num = Math.floor(Math.random() * document.getElementsByClassName('planet').length)
    this.img = document.getElementsByClassName('planet')[this.num];
    this.x = -cw;
    this.y = Math.random() * ch;
    this.angle = (-Math.PI / 6) + (Math.random() * Math.PI / 3);
    this.draw = function() {
        this.x += -2
        drawImageRotated(this.img,this.x,this.y,this.angle)
        if (this.x < -this.img.width / 2 && Math.floor(Math.random() * 50) == 0) {
            this.num++
            if (this.num > document.getElementsByClassName('planet').length - 1) {
                this.num = 0
            }
            this.img = document.getElementsByClassName('planet')[this.num];
            this.x = cw + this.img.width / 2;
            this.y = Math.random() * ch;
            this.angle = (-Math.PI / 6) + (Math.random() * Math.PI / 3);
        }
        ctx.beginPath();
        ctx.fillStyle = '#000000A0'
        ctx.fillRect(this.x-this.img.width*.6,this.y-this.img.height*.6,this.img.width*1.2,this.img.height*1.2);
    }
}
function Asteroid() {
    this.img = document.getElementsByClassName('asteroid')[Math.floor(Math.random() * document.getElementsByClassName('asteroid').length)] // image source; random element from asteroids
    this.x = Math.random() * cw; // x position
    this.y = Math.random() * ch; // y position
    this.dx = -2 + Math.random() * 4; // change in x
    this.dy = -2 + Math.random() * 4; // change in y
    this.angle = Math.random() * 2 * Math.PI; // angle of rotation
    this.da = .005 + Math.random() * .01; // change in angle
    this.draw = function() {
        this.x += this.dx;
        this.y += this.dy;
        this.angle += this.da;
        drawImageRotated(this.img,this.x,this.y,this.angle);

        if (this.x > cw + this.img.width || this.x < 0 - this.img.width ) {this.dx *= -(.5 + Math.random())}
        if (this.y > ch + this.img.height || this.y < 0 - this.img.height ) {this.dy *= -(.5 + Math.random())}
    }
}
ray = {
    outerWidth: 0,
    innerWidth: 0,
    x0 : player.x,
    y0 : player.y,
    x1 : player.x +  5 * cw * Math.cos(player.angle),
    y1 : player.y +  5 * cw * Math.sin(player.angle),
    angle : player.angle,
    draw: function() {
        if (this.outerWidth >= 0) {
            this.x0 = player.x;
            this.y0 = player.y;
            ctx.beginPath();
            ctx.moveTo(this.x0,this.y0);
            ctx.lineTo(this.x1,this.y1);
            ctx.lineWidth = this.outerWidth;
            ctx.strokeStyle ='rgb(255, 183, 0)';
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x0,this.y0);
            ctx.lineTo(this.x1,this.y1);
            ctx.lineWidth = this.innerWidth;
            ctx.strokeStyle ='rgb(255, 232, 173)';
            ctx.stroke();
        }
        this.innerWidth += -5
        this.outerWidth += -5
    },
    detectHit: function() { 
        for (var i = 0; i < enemies.length; i++) {
            var tan = Math.tan(this.angle) // slope of the ray
            var detectionRadius = this.outerWidth/2 + enemyIcon.width/2 // if enemy is within this radius of the target point, it will be exploded
            var x0 = player.x; // x source of ray
            var y0 = player.y; // y source of ray
            var x1 = enemies[i].x; // x pos of enemy
            var y1 = enemies[i].y; // y pos of enemy
            var xNear = ((tan * (tan * x0 + y1 - y0) + x1) / (Math.pow(tan,2) + 1));
            var yNear = tan * (xNear - x0) + y0;
            if (enemies[i].explosionTimer == 0) { // only affect enemies that are not exploding
                if (Math.abs(Math.atan2(y1 - y0,x1 - x0) - this.angle) <= Math.PI / 2) { // Avoid checking behind player
                    if (Math.sqrt((x1 - xNear) ** 2 + (y1 - yNear) ** 2) <= detectionRadius) { // check if enemy is within detection radius
                        enemies[i].explode(); // kill this enemy
                        enemies.push(new Enemy()) // replace killed enemies
                        if (Math.floor(Math.random() * 5) == 0) { // chance to spawn an extra enemy when one dies
                            enemies.push(new Enemy())
                        }
                    }
                }
            }
        }
    },
}
mouse = {
    x: 0,
    y: 0,
}
document.addEventListener('mousemove',function(e) { // detect if cursor is moved
    var cvsRect = cvs.getBoundingClientRect();
    mouse.x = 5*(e.clientX - cvsRect.left); // get mouse x pos
    mouse.y = 5*(e.clientY - cvsRect.top); // get mouse y pos
})
document.addEventListener('mousedown',function(e) { // fire laser
    music.loop = true
    music.play(); // start playing music
    if (!gameRunning) {
        location.reload() // reload page to reset game
    }
    if (player.cooldown <= 0) {
        player.combo = 0;
        ray.outerWidth = 100;
        ray.innerWidth = 50;
        ray.angle = player.angle;
        ray.x1 = player.x +  5 * cw * Math.cos(player.angle);
        ray.y1 = player.y +  5 * cw * Math.sin(player.angle);
        ray.detectHit();
        
        player.dx +=  -50 * Math.cos(player.angle);
        player.dy +=  -50 * Math.sin(player.angle);

        laser.play();
        player.cooldown = 25;
    }
})

function loop() {
    ctx.clearRect(0,0,cw,ch)
    if (player.combo > player.largestCombo) {
        player.largestCombo = player.combo
    }
    for (var i = 0; i < background.length; i++) {
        background[i].draw();
    }
    if (gameRunning) {
        ctx.textAlign = 'center'
        ctx.font = '100px Silkscreen'
        ctx.fillStyle = 'gold'
        ctx.fillText('Score '+player.score,cw/2,150) // display score
        if (player.combo >= 2) {
            ctx.fillText('Combo  x'+player.combo,cw/2,ch-300) // display combo if >1
        }
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].draw();
            if (enemies[i].explosionTimer >= 25) { // delete enemy once it has been exploded
                enemies.splice(i,1)
            }
        }
        ray.draw();
        player.draw();
        requestAnimationFrame(loop);
    }
    else if (!gameRunning) {
        document.fonts.load('200px Silkscreen').then(function() { // show end screen
            ctx.textAlign = 'center'
            ctx.font = '200px Silkscreen'
            ctx.fillStyle = 'white'
            ctx.fillText('Game Over',cw/2,ch/2)
            ctx.font = '150px Silkscreen'
            ctx.fillStyle = 'gold'
            ctx.fillText('Score: '+player.score,cw/2,ch/2+200)
            ctx.fillText('Biggest Combo: '+player.largestCombo,cw/2,ch/2+400)
            ctx.font = '100px Silkscreen'
            ctx.fillStyle = 'lightgray'
            ctx.fillText('Click anywhere to restart',cw/2,ch/2+600)
        })
        
    }
}
{
    for (var i = 0; i < 50; i++) {
        background.push(new Star());
    }
    background.push(new Planet());
    for (var i = 0; i < 4; i++) {
        background.push(new Asteroid());
    }
}
for (var i = 0; i < 5; i++) {
    enemies.push(new Enemy())
}
requestAnimationFrame(loop);
