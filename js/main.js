'use strict';


function getCanvas(id) {
  function CanvasFactory() {
    this.style = {
      height: document.getElementById(id).getAttribute('height'),
      width: document.getElementById(id).getAttribute('width')
    };

    this.ctx = (function () {
      let element = document.getElementById('gamvas');
      return element.getContext('2d');
    })();
  }
  return new CanvasFactory();
}

// gestion du snake
function getSnake(canvas) {
  var canvasXmax = canvas.style.width;
  var canvasYmax = canvas.style.height;

  /**
   * Get a random number with a maximun an a minimun
   * @param   {Number} max      The max number
   * @param   {Number} min      The min number
   * @returns {Number} integer  Return a integer
   */
  function getRandomNumber(max, min = 0) {
    var num = Math.random() * (max - min);
    return parseInt(num, 10);
  }

  /**
   * Calculate the position IN the canvas
   * @param   {Number}  canvasSize  Can be height or width.
   * @param   {Number}  snakeSize   Height or width of the snake style.
   * @returns {Number}              Return a integer
   */
  function getSnakePositionRandom(canvasSize, snakeSize) {
    var max = canvasSize - snakeSize;
    return getRandomNumber(max);
  }

  function addPx(position) {
    var snake = this;
    return function () {
      snake.position[position] += snake.params.speed;
    };
  }

  function rmvPx(position) {
    var snake = this;
    return function () {
      snake.position[position] -= snake.params.speed;
    };
  }

  function SnakeFactory() {
    this.params = {
      speed: 3
    };
    this.style = {
      height: 10,
      width: 10,
      color: 'red'
    };
    this.position = {
      x: '',
      y: ''
    };
    this.tail = [];
    this.move = {
      left: '',
      top: '',
      right: '',
      down: ''
    };
  }

  var snake = new SnakeFactory();
  snake.position.x = getSnakePositionRandom(canvasXmax, snake.style.width);
  snake.position.y = getSnakePositionRandom(canvasYmax, snake.style.height);

  snake.move.left = rmvPx.call(snake, 'x');
  snake.move.top = rmvPx.call(snake, 'y');
  snake.move.right = addPx.call(snake, 'x');
  snake.move.down = addPx.call(snake, 'y');
  return snake;
}

// gestion de l affichage
function getGpu(canvas, snake) {
  function GpuFactory() {
    this.ctx = canvas.ctx;
    this.drawSnake = function () {
      this.ctx.fillStyle = snake.style.color;
      this.ctx.fillRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
    this.clearSnake = function () {
      this.ctx.clearRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
  }
  return new GpuFactory();
}

/**
 * Gestion du keyboard pour assurer le fluidité de l animation, lance le manager de l animation
 * @returns {KeyboardManagerFactory}
 */
function getKeyboardManager(animationManager) {
  function KeyboardManagerFactory() {
    this.firstKeydown = true;
    this.mapping = {37: 'left', 38: 'top', 39: 'right', 40: 'down'};
    this.setKeydown = function (keyCode) {
      if (this.mapping[keyCode]) {
        if (this.firstKeydown === true) {
          animationManager.run(this.mapping[keyCode]);
          // => lance l animation
          this.firstKeydown = false;// je bloque la recursion du clavier
        }
      }
    };
    this.setKeyup = function (keycode) {
      if (this.mapping[keycode]) {
        animationManager.stop();
        this.firstKeydown = true;
      }
    };
  }

  return new KeyboardManagerFactory();
}
/**
 *
 * @param gpu
 * @param snake
 * @returns {AnimationManagerFactory}
 */
function getAnimationManager(gpu, snake) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function builderSnakeMove(direction, animationManager) {
    return function snakeMove() {
      gpu.clearSnake();
      snake.move[direction]();
      gpu.drawSnake();
      var lastID = window.requestAnimationFrame(snakeMove);
      animationManager.lastAnimationFrame = lastID;
    };
  }

  function AnimationManagerFactory() {
    this.lastAnimationFrame = 0;
    this.run = function (direction) {
      this.lastAnimationFrame = window.requestAnimationFrame(builderSnakeMove(direction, this));
    };
    this.stop = function () {
      cancelAnimationFrame(this.lastAnimationFrame);
    };

  }
  return new AnimationManagerFactory();
}

/**
 * Listener sur le keydown et keyup du clavier
 * @param keyboardManager
 */
function listenerKeyboard(keyboardManager) {
  window.addEventListener('keydown', function (e) {
  console.log(e.keyCode);

      keyboardManager.setKeydown(e.keyCode);

  });

  window.addEventListener('keyup', function (e) {
    keyboardManager.setKeyup(e.keyCode);
  });
}


window.addEventListener('load', function () {
  var canvas = getCanvas('gamvas');
  // console.log(canvas);
  var snake = getSnake(canvas);
  // console.log(snake);
  var gpu = getGpu(canvas, snake);
  gpu.drawSnake();

  var animationManager = getAnimationManager(gpu, snake);
  // console.log(gpu);
  var keyboardManager = getKeyboardManager(animationManager);
  // console.log(command);

  listenerKeyboard(keyboardManager);

});
