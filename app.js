var app = a = {};
a.listeners = a.l = {};
a.handlers = a.h = {};

a.canvas = undefined;
a.context = undefined;
a.controls = undefined;

a.game = a.g = {};

a.g.width = a.g.w = 640;
a.g.height = a.g.h = 480;
a.g.scale = a.g.s = 20;
a.g.pause = true;

document.addEventListener('DOMContentLoaded', function() {
  // bind elements
  a.controls = document.getElementById('mobile-controls');
  a.canvas = document.getElementById('canvas');

  // set up canvas
  a.context = a.canvas.getContext('2d');

  // listen for events
  window.addEventListener('keydown', a.l.onKeyDown);
  a.canvas.addEventListener('touchstart', a.l.onTouchCanvas);
  a.controls.addEventListener('touchstart', a.l.onTouchControls);

  // start it up
  a.g.startGame();
});

// LISTENER FUNCTIONS
a.l.onKeyDown = function(event) {
  var k = event.keyCode;
  if (k === 32 || k === 13) { a.h.pause(); }
  else if (k === 37 || k === 65) { a.h.changeDir('left'); }
  else if (k === 39 || k === 68) { a.h.changeDir('right'); }
  else if (k === 38 || k === 87) { a.h.changeDir('up'); }
  else if (k === 40 || k === 83) { a.h.changeDir('down'); }
}
a.l.onTouchCanvas = function(event) {
  a.h.pause();
}
a.l.onTouchControls = function(event) {
  var x = event.touches[0].pageX;
  var y = event.touches[0].pageY;
  var l = 0; var r = w = 640;
  var u = a.controls.getClientRects()[0].top;
  var d = a.controls.getClientRects()[0].bottom;
  var h = d - u;
  var deltaX = x - w/2;
  var deltaY = (y - u) - h/2;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) { a.h.changeDir('right'); }
    else { a.h.changeDir('left'); }
  } else {
    if (deltaY > 0) { a.h.changeDir('down'); }
    else { a.h.changeDir('up'); }
  }
}

// HANDLER FUNCTIONS
a.h.changeDir = function(direction) {
  var d = direction;
  if (d === 'left' && a.g.right || d === 'right' && a.g.left ||
      d === 'up' && a.g.down || d === 'down' && a.g.up ||
      a.g.turned) {
    return;
  }
  a.g.left = a.g.right = a.g.up = a.g.down = false;
  if (d === 'right') { a.g.right = true; }
  else if (d === 'left') { a.g.left = true; }
  else if (d === 'up') { a.g.up = true; }
  else if (d === 'down') { a.g.down = true; }
  a.g.turned = true;
}
a.h.pause = function() {
  if (a.g.intervalID === undefined) { a.g.startGame(); }
  else if (a.g.pause === true) { a.g.pause = false; }
  else { a.g.pause = true; }
}

// GAME FUNCTIONS
a.g.loop = function() {
  // do nothing if paused
  if (a.g.pause === true) { return; }

  // clear it off
  a.context.clearRect(0,0,a.g.w,a.g.h);

  // move it
  if (a.g.right) { a.g.x += a.g.s; }
  else if (a.g.left) { a.g.x -= 20; }
  else if (a.g.up) { a.g.y -= a.g.s; }
  else if (a.g.down) { a.g.y += a.g.s; }
  a.g.turned = false;

  // check it
  if (a.g.x >= a.g.w) { a.g.x = 0; }
  else if (a.g.x < 0) { a.g.x = a.g.w-a.g.s; }
  else if (a.g.y >= a.g.h) { a.g.y = 0; }
  else if (a.g.y < 0) { a.g.y = a.g.h-a.g.s; }

  // doneskis
  a.g.gameOver();

  // eat it
  a.g.eatLeaf();

  // draw it
  a.g.drawGame();
}

a.g.eatLeaf = function() {
  if (a.g.x === a.g.leafX && a.g.y === a.g.leafY) {
    var lastX = a.g.caterpillar[a.g.caterpillar.length-1][0];
    var lastY = a.g.caterpillar[a.g.caterpillar.length-1][1];
    var penultimateX = a.g.caterpillar[a.g.caterpillar.length-2][0];
    var penultimateY = a.g.caterpillar[a.g.caterpillar.length-2][1];
    var tailX = lastX - (penultimateX-lastX);
    var tailY = lastY - (penultimateY-lastY);
    a.g.caterpillar.push([lastX,lastY]);
    a.g.leafX = undefined;
    a.g.leafY = undefined;
    a.g.spawnLeaf();
  }
  return;
}
a.g.spawnLeaf = function() {
  a.g.leafX = Math.random()*a.g.w; a.g.leafX -= a.g.leafX % a.g.s;
  a.g.leafY = Math.random()*a.g.h; a.g.leafY -= a.g.leafY % a.g.s;
}

a.g.startGame = function() {
  a.g.initialize();
  a.g.intervalID = window.setInterval(a.g.loop, 100);
}
a.g.initialize = function() {
  a.g.caterpillar = [[80,20],[60,20],[40,20],[20,20]];
  a.g.leafX = 300
  a.g.leafY = 200;

  a.g.x = 80;
  a.g.y = 20;

  a.g.left = false;
  a.g.right = true; // moves right at the start
  a.g.up = false;
  a.g.down = false;

  a.g.lose = false;
}
a.g.gameOver = function() {
  var c = a.g.caterpillar.slice(1);
  var headX = a.g.caterpillar[0][0];
  var headY = a.g.caterpillar[0][1];
  for (var i of c) {
    if (i[0] === headX && i[1] === headY) {
      window.clearInterval(a.g.intervalID);
      a.g.intervalID = undefined;
      a.g.lose = true;
    }
  }
}

a.g.drawGame = function() {
  a.g.drawCaterpillar();
  a.g.drawLeaf();
  a.g.drawLose();
}
a.g.drawCaterpillar = function() {
  a.g.caterpillar.pop();
  a.g.caterpillar.unshift([a.g.x,a.g.y]);
  a.context.fillStyle = 'green';
  if (a.g.lose) { a.context.fillStyle = 'red'; }
  for (var i of a.g.caterpillar) {
    a.context.fillRect(i[0],i[1],a.g.s,a.g.s);
  }
}
a.g.drawLeaf = function() {
  a.context.fillStyle = 'black';
  a.context.fillRect(a.g.leafX,a.g.leafY,a.g.s,a.g.s);
}
a.g.drawLose = function() {
  if (!a.g.lose) { return; }
  a.context.font = "5rem ShortStack";
  a.context.fillText('Game Over',100,100,440);
  a.context.fillText(a.g.caterpillar.length,300,200,440);
}
