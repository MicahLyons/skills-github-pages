const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const grid = cvs.width / 64;

let rect = cvs.getBoundingClientRect(); //Depixelate
cvs.width = rect.width * devicePixelRatio;
cvs.height = rect.height * devicePixelRatio;
ctx.scale((devicePixelRatio),(devicePixelRatio));
cvs.style.width = '800px';
cvs.style.height = '500px';
const cw = 2400;
const ch = 1500;

let sound = {
    // hit: document.getElementById("boing"),
    // net: document.getElementById("boing"),
    // groundBounce: document.getElementById("boing"),
    hit: document.getElementById("hit"),
    net: document.getElementById("net"),
    groundBounce: document.getElementById("groundBounce"),
    music: document.getElementById("eliminator"),
}
sound.music.loop = true
sound.music.load()
sound.music.play();

let player1 = {
    x: 0,
    y: ch-100,
    width: 200,
    height: 400,
    movementLR: [false,false],
    dy:0,
    image: document.getElementById("blu_b1"),
    draw: function() {
        ctx.drawImage(this.image,this.x,this.y-this.height,this.width,this.height)
        if (this.movementLR[0]) {this.x -= 18};
        if (this.movementLR[1]) {this.x += 18};
        this.y += this.dy;
        if (this.y < ch-100) {
            this.dy += 2
        } else {this.dy = 0};
        if (this.x + this.width >= cw/2) {
            this.x = cw/2 - this.width;
        }
        if (this.x <= -this.width/2) {
            this.x = -this.width/2;
        }
    }
}
let player2 = {
    x: 2250,
    y: ch-100,
    width: 200,
    height: 400,
    movementLR: [false,false],
    dy:0,
    image: document.getElementById("blu_b2"),
    draw: function() {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.image,-this.x,this.y-this.height,-this.width,this.height)
        ctx.restore();        
        if (this.movementLR[0]) {this.x -= 18};
        if (this.movementLR[1]) {this.x += 18};
        this.y += this.dy;
        if (this.y < ch-100) {
            this.dy += 2
        } else {this.dy = 0};
        if (this.x <= cw/2) {
            this.x = cw/2;
        }
        if (this.x + this.width/2 >= cw) {
            this.x = cw - this.width/2;
        }
    }
}

let ball = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    dia: 100,
    serving: false,
    angle: 0,
    image: document.getElementById("volleyball"),
    dead: false,
    bounces: 0,
    draw: function() {
        this.x += this.dx * (100/this.dia)
        this.y += this.dy * (100/this.dia)
        if (this.dx > 0) {this.angle += .3}
        if (this.dx < 0) {this.angle += -.3}
        if (this.dy <= 25 && !this.serving) {this.dy += 2}
        if (this.y >= ch-100-this.dia) {
            sound.groundBounce.load()
            sound.groundBounce.play()
            this.dy *= -.75;
            this.y = ch-101-this.dia
            this.dead = true;
            this.bounces += 1
            if (this.bounces >= 4) {
                resetBall(1)
            }
        }

        if (this.y + this.dia <= player1.y - 100 && this.x + this.dia >= player1.x && this.x <= player1.x + player1.width && this.y + this.dia >= player1.y - player1.height) {
            sound.hit.load()
            sound.hit.play()
            this.dy = -50 + .3 * player1.dy
            this.dx = 20
            ball.bounces = 0
            if (player1.movementLR[0]) {this.dx += -5}
            if (player1.movementLR[1]) {
                this.dx += 5
                if (ball.dia == 100 && ball.y < ch - 800 && player1.y < ch-200 && Math.abs(player1.x + player1.width - cw/2) <= 300) {
                    this.dx += 15
                    this.dy = 15
                } else if (ball.dia == 100 && ball.y < ch - 900) {
                    this.dx += 20
                    this.dy = -15
                }
            }
        }
        if (this.y + this.dia <= player2.y - 100 && this.x + this.dia >= player2.x && this.x <= player2.x + player2.width && this.y + this.dia >= player2.y - player2.height) {
            sound.hit.load()
            sound.hit.play()
            this.dy = -50 + .3 * player2.dy
            this.dx = -20
            ball.bounces = 0
            if (player2.movementLR[0]) {
                this.dx += -5
                if (ball.dia == 100 && ball.y < ch - 800 && player2.y < ch-200 && Math.abs(player2.x - cw/2) <= 300) {
                    this.dx += -15
                    this.dy = 15
                } else if (ball.dia == 100 && ball.y < ch - 900) {
                    this.dx += -20
                    this.dy = -10
                }
            }
            if (player2.movementLR[1]) {this.dx += 5}
        }

        if (this.dx <= 0 && this.x - cw/2 <= 30 && this.x >= cw/2 && this.y + this.dia >= ch-750) {
            this.dx *= -1
            sound.net.load()
            sound.net.play()
        }
        if (this.dx >= 0 && cw/2 - (this.x + this.dia) <= 30 && (this.x + this.dia) <= cw/2 && this.y + this.dia >= ch-750) {
            this.dx *= -1
            sound.net.load()
            sound.net.play()
        }

        if (this.y + this.dia >= ch-750 && this.x <= cw/2 && this.x + this.dia >= cw/2) {
            this.dy *= -1;
            sound.net.load()
            sound.net.play()
        }
        //ctx.drawImage(this.image,this.x,this.y,this.dia,this.dia);
        {
            ctx.save();
            ctx.translate(this.x + this.dia/2 , this.y + this.dia/2);
            ctx.rotate(this.angle);
            ctx.translate(-this.x - this.dia/2,-this.y - this.dia/2);
            ctx.drawImage(this.image, this.x, this.y, this.dia, this.dia);
            ctx.restore();
        }
    }

}
let clouds = {
    width:4800,
    height:480,
    x1:0,
    x2:-4800,
    x3:0,
    x4:-4800,
    draw: function() {
        this.x1 += 1;
        this.x2 += 1;
        if (this.x1 >= cw) {this.x1 = -1*this.width}
        if (this.x2 >= cw) {this.x2 = -1*this.width}
        ctx.drawImage(document.getElementById("clouds"),this.x1,100,this.width,this.height)
        ctx.drawImage(document.getElementById("clouds"),this.x2,100,this.width,this.height)
        this.x3 += 2;
        this.x4 += 2;
        if (this.x3 >= cw) {this.x3 = -1*this.width}
        if (this.x4 >= cw) {this.x4 = -1*this.width}
        ctx.drawImage(document.getElementById("clouds2"),this.x3,100,this.width,this.height)
        ctx.drawImage(document.getElementById("clouds2"),this.x4,100,this.width,this.height)
    }
}

let frameTime = 16
let blu_b = [document.getElementById("blu_b2"),document.getElementById("blu_b1")]
let blu_s = [document.getElementById("blu_s1"),document.getElementById("blu_s2")]
let blu_srv = [document.getElementById("blu_srv"),document.getElementById("blu_srv")]
function animatePlayers(position,player) {
    if (frameTime > 0) {frameTime += -1}
    if (frameTime == 0) {frameTime = 20}
    if (frameTime > 10) {
        player.image = position[0]
    } 
    if (frameTime <= 10 && (player.movementLR[0] == true || player.movementLR[1] == true)) {
        player.image = position[1]
    }
    if (frameTime > 10) {
        player.image = position[0]
    } 
    if (frameTime <= 10 && (player.movementLR[0] == true || player.movementLR[1] == true)) {
        player.image = position[1]
    }
    

}

function loop() {
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(document.getElementById("background"),0,0,cw,ch);
    clouds.draw()
    player1.draw();
    player2.draw();
    if (ball.y + ball.dia >= player1.y - player1.height && !ball.serving || ball.x >= cw/2) {animatePlayers(blu_b,player1)}
    else if (!ball.serving || ball.x >= cw/2) {animatePlayers(blu_s,player1)}    
    if (ball.serving && ball.x <= cw/2) {animatePlayers(blu_srv,player1)}

    if (ball.y + ball.dia >= player2.y - player2.height && !ball.serving || ball.x <= cw/2) {animatePlayers(blu_b,player2)}
    else if (!ball.serving || ball.x <= cw/2) {animatePlayers(blu_s,player2)} 
    if (ball.serving && ball.x >= cw/2) {animatePlayers(blu_srv,player2)}

    ctx.fillStyle = "#cdcdcd";
    ctx.fillRect(cw/2-20,ch-750,40,300);
    ctx.fillStyle = "#000000";
    ctx.fillRect(cw/2-10,ch-750,20,650);
    ball.draw();
    requestAnimationFrame(loop);
}

function resetBall(side) {
    player1.x = 0
    player2.x = cw - player2.width
    player1.y = ch-100
    player2.y = ch-100
    ball.serving = true
    ball.dx = 0;
    ball.dy = 0;
    if (side == 1) {
        ball.x = 100;
        ball.y = player1.y - player1.height - ball.dia - 5
    }
    if (side == 2) {
        ball.x = cw-100-ball.dia;
        ball.y = player2.y - player2.height - ball.dia - 5
    }
    ball.bounces = 0
    ball.dead = false
}

document.addEventListener('keydown', function(e) {
    if (e.key == 'a') {
        player1.movementLR[0] = true;
        if (ball.x <= cw/2) {ball.serving = false;}
    } if (e.key == 'd') {
        player1.movementLR[1] = true;
        if (ball.x <= cw/2) {ball.serving = false;}
    }
    if (e.key == 'w' && player1.y >= ch-100) {
        player1.dy = -40;
        if (ball.x <= cw/2) {ball.serving = false;}
    }
    if (e.key == 'j') {
        player2.movementLR[0] = true;
        if (ball.x >= cw/2) {ball.serving = false;}
    } if (e.key == 'l') {
        player2.movementLR[1] = true;
        if (ball.x >= cw/2) {ball.serving = false;}
    }
    if (e.key == 'i' && player2.y >= ch-100) {
        player2.dy = -40;
        if (ball.x >= cw/2) {ball.serving = false;}
    }
    if (e.key == '1') {
        resetBall(1)
    }
    if (e.key == '2') {
        resetBall(2)
    }
})
document.addEventListener('keyup', function(e) {
    if (e.key == 'a') {
        player1.movementLR[0] = false
    } if (e.key == 'd') {
        player1.movementLR[1] = false
    }
    if (e.key == 'j') {
        player2.movementLR[0] = false
    } if (e.key == 'l') {
        player2.movementLR[1] = false
    }
})
resetBall(1);