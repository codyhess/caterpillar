var app = a = {};
a.listeners = a.l = {};
a.handlers = a.h = {};

a.game = a.g = {};
a.g.caterpillar = [[80,20],[60,20],[40,20],[20,20]];

a.g.x = 80;
a.g.y = 20;
a.g.scale = a.g.s = 20;
a.g.pause = true;
a.g.left = false;
a.g.right = true; // moves right at the start
a.g.up = false;
a.g.down = false;

a.canvas = undefined;
a.context = undefined;

document.addEventListener('DOMContentLoaded', function() {
  // set up canvas
  a.canvas = document.getElementById('canvas');
  a.context = a.canvas.getContext('2d');
  a.context.fillStyle = "green";

  // listen for keypresses
  window.addEventListener('keydown', a.l.onKeyDown);
  a.canvas.addEventListener('touchstart', a.l.onTouchCanvas);

  // start it up
  window.setInterval(a.g.loop, 100);
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

// HANDLER FUNCTIONS
a.h.changeDir = function(direction) {
  var d = direction;
  if (d === 'left' && a.g.right || d === 'right' && a.g.left ||
      d === 'up' && a.g.down || d === 'down' && a.g.up) {
    return;
  }
  a.g.left = a.g.right = a.g.up = a.g.down = false;
  if (d === 'right') { a.g.right = true; }
  else if (d === 'left') { a.g.left = true; }
  else if (d === 'up') { a.g.up = true; }
  else if (d === 'down') { a.g.down = true; }
}
a.h.pause = function() {
  if (a.g.pause === true) { a.g.pause = false; }
  else { a.g.pause = true; }
}

// GAME FUNCTIONS
a.g.loop = function() {
  var s = 20; // scale
  var w = 640 // width
  var h = 480; // height

  // do nothing if paused
  if (a.g.pause === true) { return; }

  // clear it off
  a.context.clearRect(0,0,w,h);

  // move it
  if (a.g.right) { a.g.x += 20; }
  else if (a.g.left) { a.g.x -= 20; }
  else if (a.g.up) { a.g.y -= 20; }
  else if (a.g.down) { a.g.y += 20; }

  // check it
  if (a.g.x >= w) { a.g.x = 0; }
  else if (a.g.x < 0) { a.g.x = w-s; }
  else if (a.g.y >= h) { a.g.y = 0; }
  else if (a.g.y < 0) { a.g.y = h-s; }

  // draw it
  a.g.drawCaterpillar();
}

a.g.drawCaterpillar = function() {
  a.g.caterpillar.pop();
  a.g.caterpillar.unshift([a.g.x,a.g.y]);
  for (var i of a.g.caterpillar) {
    a.context.fillRect(i[0],i[1],a.g.s,a.g.s);
  }
}
