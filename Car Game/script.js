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

const track1 = document.getElementById('track1')
const scale = 3
let backgroundX,backgroundY;
let g = 'grass'
let r = 'road'
let map = 
    [
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g],
    [g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g],
    [g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g],
    [g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g],
    [g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g],
    [g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g]
    ]
let gridY = ch/map.length
let gridX = cw/map[0].length 
function drawMap() {
    // for (var i = 0; i < map.length; i++) {
    //     for (var j = 0; j < map[i].length; j++) {
    //         if (map[i][j] == g) {
    //             ctx.fillStyle = 'lime';
    //             ctx.fillRect(j*gridX,i*gridY,gridX,gridY);
    //         } else if (map[i][j] == r) {
    //             ctx.fillStyle = 'white';
    //             ctx.fillRect(j*gridX,i*gridY,gridX,gridY);
    //         }
    //     }
    // }
    // ctx.drawImage(track1, 0, 0, cw, ch);
}

let car = {
    width:100,
    v:1,
    x:200,
    y:250,
    dx:0,
    dy:0,
    a:0,
    da:[0,0],
    mass:1,
    px:0,
    py:0,
    steering:[false,false],
    image:document.getElementById('car1'),
    draw: function() {
        // if (this.x <= 0  || this.x >= cw || this.y <= 0 || this.y >= ch) {
        //     this.x = 200
        //     this.y = 250
        //     this.a = 0
        //     this.v = 1
        // }

        if (this.steering[0]) {
            if (this.da[0] < .025) {
                this.da[0] += .001
            }
            this.a += -this.da[0] * Math.sqrt(this.v);
        } if (!this.steering[0] && this.da[0] > 0) {
            this.da[0] += -.001
        } if (this.steering[1]) {
            if (this.da[1] < .025) {
                this.da[1] += .001
            }
            this.a += this.da[1] * Math.sqrt(this.v);
        } if (!this.steering[1] && this.da[1] > 0) {
            this.da[1] += -.001
        } if (this.v >= 5 && (this.da[0] >= .025 || this.da[1] >= .025)) {
            tireTrail.push(new tireMark())
        }
        
        if (this.v >= 5.005) {
            this.v += -.005
        } if (this.v < 5) {
            this.v += .02
        }
        
        if (this.px < this.dx) {
            this.px += .05
        } if (this.px > this.dx) {
            this.px -= .05
        } if (this.py < this.dy) {
            this.py += .05
        } if (this.py > this.dy) {
            this.py -= .05
        }

        if (this.x > 0 && this.y > 0 && this.x < cw && this.y < ch) {
            this.tileX = Math.floor((this.x+this.width/2)/gridX)
            this.tileY = Math.floor((this.y+this.width/2)/gridY)
        } else {this.tileX = 0;this.tileY = 0}

        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.tileX*gridX,this.tileY*gridY,gridX,gridY);
        if (map[this.tileY][this.tileX] == 'grass' && this.v > 3) {
            this.v += -.2
            this.px = 0
            this.py = 0
        }
        
        this.dx = this.v * Math.cos(this.a);
        this.dy = this.v * Math.sin(this.a);

        this.x += this.dx + this.px;
        this.y += this.dy + this.py;
        
        // ctx.save();
        // ctx.translate(this.x + this.width/2 , this.y + this.width/2);
        // ctx.rotate(this.a);
        // ctx.translate(-this.x - this.width/2,-this.y - this.width/2);
        // ctx.drawImage(this.image, this.x, this.y, this.width, this.width);
        // ctx.restore();

        {
            var backgroundWidth = cw
            var backgroundHeight = ch
            backgroundX = -this.x * scale - this.width * scale/2 + cw/2 - 300 * Math.cos(this.a)
            backgroundY = -this.y * scale - this.width * scale/2 + ch/2 - 300 * Math.sin(this.a)

            ctx.drawImage(track1,backgroundX,backgroundY,backgroundWidth * scale,backgroundHeight * scale)

            for (var i = 0; i < tireTrail.length; i++) {
                tireTrail[i].draw()
            }

            ctx.save();
            ctx.translate(cw/2 - 300 * Math.cos(this.a),ch/2 - 300 * Math.sin(this.a));
            ctx.rotate(this.a);
            ctx.translate(-cw/2 + 300 * Math.cos(this.a),-ch/2 + 300 * Math.sin(this.a));
            ctx.drawImage(this.image, cw/2-this.width * scale/2 - 300 * Math.cos(this.a), ch/2-this.width * scale/2 - 300 * Math.sin(this.a), this.width * scale, this.width * scale);
            ctx.restore();
        }
    },
}

const tireTrail = [];
function tireMark() {
    this.x = car.x + car.width/2 - 40 * Math.cos(car.a)
    this.y = car.y + car.width/2 - 40 * Math.sin(car.a)
    this.x2 = car.x + car.width/2 - 45 * Math.cos(car.a)
    this.y2 = car.y + car.width/2 - 45 * Math.sin(car.a)
    this.a = car.a + Math.PI / 2
    this.t = 70
    this.draw = function() {
        this.t += -1
        this.cx = backgroundX + this.x * scale
        this.cy = backgroundY + this.y * scale
        this.cx2 = backgroundX + this.x2 * scale
        this.cy2 = backgroundY + this.y2 * scale

        {
            ctx.fillStyle = 'rgba(0%,0%,0%,'+Math.floor(this.t)+'%)'
            ctx.beginPath()
            ctx.arc(this.cx + 30 * Math.cos(this.a),this.cy + 30 * Math.sin(this.a),10,0,Math.PI*2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(this.cx - 30 * Math.cos(this.a),this.cy - 30 * Math.sin(this.a),10,0,Math.PI*2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(this.cx2 + 30 * Math.cos(this.a),this.cy2 + 30 * Math.sin(this.a),10,0,Math.PI*2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(this.cx2 - 30 * Math.cos(this.a),this.cy2 - 30 * Math.sin(this.a),10,0,Math.PI*2)
            ctx.fill()
        }

        if (this.t <= 0) {
            tireTrail.splice(this,1)
        }
    }
}
function loop() {
    ctx.clearRect(0,0,cw,ch);
    drawMap();
    car.draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

document.addEventListener('keydown',function(e) {
    if (e.key == 'a') {
        car.steering[0] = true
    }
    if (e.key == 'd') {
        car.steering[1] = true
    }
})
document.addEventListener('keyup',function(e) {
    if (e.key == 'a') {
        car.steering[0] = false
    }
    if (e.key == 'd') {
        car.steering[1] = false
    }
})
