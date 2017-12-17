const randomStartPos = () => (Math.random().toFixed(1) * -1010) - 101;
const randomSpeed = () => (Math.random().toFixed(1) * 100) + 60;
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83,
    START_Y = 65;

// Enemy class
var Enemy = function([x = -1, y = 1, s = 1] = []) {
  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  this.speed = s;
};
Enemy.prototype.update = function(dt) {
  /*  Update the enemy's position, required method for game.
  *  Parameter: dt, a time delta between ticks.
  *  Multiplying any movement by the dt parameter will ensure the game runs at
  *  the same speed for all computers.
  */

  /*  When an enemy is far enough outside of the game screen, reset it's
  *  position to something left outside of the screen, to 'recycle' it, so
  *  the enemies don't 'run out', making the game too easy.
  */
  if(this.x > 500) {
    this.x = randomStartPos();
  }
  // If the enemy is still in the game screen, just move it along.
  else {
    this.x += this.speed * dt;
  }
};
Enemy.prototype.render = function() {
  // Draw the enemy on the screen, required method for game
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = TILE_WIDTH * 2;
  this.y = (TILE_HEIGHT * 5)-18;
  this.score = 0;
  this.mobile = true;
  this.won = false;
};

/*  Move the player while making sure the player cannot move outside of the
*  screen bounds by checking wether the requested move (either left, right,
*  up or down) will place the player outside of the screen bounds.
*  If this is the case, don't move the player, if not, move :)
*/
Player.prototype.update = function(dir = [0,0]){
  let curX = this.x,
  newX = this.x + dir[0],
  curY = this.y,
  newY = this.y + dir[1];

  if(this.y !== -18){
    if(newX >= 0 && newX < 504) this.x = newX;
    if(newY > -19 && newY < 398) this.y = newY;
  } else {
    // If the player has reached the top row, the player has won
    this.wins();
  }
};
Player.prototype.render = function(){
  // Draw the player's image/sprite at it's position
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*  Convert arrow keys pressed by the player into pixels to move, either
*  horizontally or vertically, and pass these values into the update() method.
*/
Player.prototype.handleInput = function(dir){
  if(this.mobile){
    switch (dir) {
      case 'left':
        this.update([-TILE_WIDTH, 0]);
        break;
      case 'up':
        this.update([0, -TILE_HEIGHT]);
        break;
      case 'right':
        this.update([TILE_WIDTH, 0]);
        break;
      case 'down':
        this.update([0, TILE_HEIGHT]);
        break;
      default:
        this.update([0, 0]);
        break;
    }
  }
};

Player.prototype.wins = function() {
  /*  Setting this variable to true will make the main() function in engine.js
  *  show a screen over the game declaring the player has won.
  */
  this.won = true;
};
Player.prototype.loses = function() {
  // Change the player's image/sprite so he appears dead.
  this.sprite = 'images/char-boy-dead.png';
  // Make all enemies stop moving to signal the game has ended.
  allEnemies.forEach(function(enemy) {
    enemy.speed = 0;
  });
  // Disable the player moving.
  this.mobile = false;
  /* Wait a little bit before resetting the game, so the player can see what
  * happend, instead of just reappearing at the start position without any
  * feedback
  */
  window.setTimeout(function() {
    resetGame();
  }, 1600);
};

/* Instantiate objects.
* Place all enemy objects in an array called allEnemies
* Place the player object in a variable called player
*/
var speeds = [
  randomSpeed(),
  randomSpeed(),
  randomSpeed()
],
allEnemies = [
  new Enemy([randomStartPos(), START_Y, speeds[0]]),
  new Enemy([randomStartPos(), START_Y, speeds[0]]),
  new Enemy([randomStartPos(), START_Y, speeds[0]]),
  new Enemy([randomStartPos(), START_Y + TILE_HEIGHT, speeds[1]]),
  new Enemy([randomStartPos(), START_Y + TILE_HEIGHT, speeds[1]]),
  new Enemy([randomStartPos(), START_Y + TILE_HEIGHT, speeds[1]]),
  new Enemy([randomStartPos(), START_Y + (TILE_HEIGHT * 3), speeds[2]]),
  new Enemy([randomStartPos(), START_Y + (TILE_HEIGHT * 3), speeds[2]]),
  new Enemy([randomStartPos(), START_Y + (TILE_HEIGHT * 3), speeds[2]])
],
player = new Player();

/* This listens for key presses and sends the keys to the
* Player.handleInput() method.
*/
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'p'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
