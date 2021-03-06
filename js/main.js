'use strict';
/* eslint-disable func-names */

/**
 * Get a object about the canvas html
 * @param {string}          id - The id of the canvas element
 * @returns {CanvasFactory} Return canvas object
 */
function getCanvas(id) {
  function CanvasFactory() {
    /**
     * Collects the size and width of the canvas
     * @type {{height: string, width: string}}
     */
    this.style = {
      height: document.getElementById(id).getAttribute('height'),
      width: document.getElementById(id).getAttribute('width')
    };
    /**
     * The default position of the canvas
     * @type {{x: number, y: number}}
     */
    this.position = {
      x: 0,
      y: 0
    };
    /**
     * @return {(CanvasRenderingContext2D)} Return a 2d context
     */
    this.ctx = (function () {
      let element = document.getElementById('gamvas');
      return element.getContext('2d');
    })();
  }
  return new CanvasFactory();
}

/**
 * Get a random number with a maximun an a minimun
 * @param   {Number} [max]      The max number
 * @param   {Number} [min]      The min number
 * @returns {Number} integer  Return a integer
 */
function getRandomNumber(max, min = 0) {
  let num = Math.random() * (max - min);
  return parseInt(num, 10);
}

/**
 * Return a Apple object
 * @param {CanvasFactory}  canvas A canvas factory object
 * @return {AppleFactory} Return a apple object
 */
function getApple(canvas) {
  function AppleFactory() {
    /**
     * Define the style of the apple
     * @type {{height: number, width: number, color: string}}
     */
    this.style = {
      height: 10,
      width: 10,
      color: '#ea0b29'
    };
    /**
     * Init a random position
     * @type {{x: number, y: number}}
     */
    this.position = {
      x: getRandomNumber((canvas.style.width  - this.style.height)),
      y: getRandomNumber((canvas.style.height - this.style.width))
    };
    /**
     * Define a new random position of the apple
     * @return {void}
     */
    this.newPosition = function () {
      this.position.x = getRandomNumber((canvas.style.width  - this.style.height));
      this.position.y = getRandomNumber((canvas.style.height - this.style.width));
    };
    /**
     * Reload / reset the apple object
     * @return {void}
     */
    this.reload =  function () {
      this.newPosition();
    };
  }
  return new AppleFactory();
}

/**
 * Get a snake object
 * @param {CanvasFactory}   canvas - A canvas object
 * @returns {SnakeFactory}  Return a snake object
 */
function getSnake(canvas) {
  let canvasXmax = canvas.style.width;
  let canvasYmax = canvas.style.height;

  /**
   * Get a random position between two number
   * @param   {Number}  canvasSize  Can be height or width.
   * @param   {Number}  snakeSize   Height or width of the snake style.
   * @returns {Number}              Return a integer
   */
  function getSnakePositionRandom(canvasSize, snakeSize) {
    let max = canvasSize - snakeSize;
    return getRandomNumber(max);
  }

  /**
   * Build a dynamic function for add px to the snake
   * @param {number}      position - can be x or y coordonne
   * @returns {Function}  Return a function
   */
  function addPx(position) {
    let snake = this;
    return function () {
      snake.position[position] += snake.params.speed;
    };
  }

  /**
   * Build a dynamic function for remove px to the snake
   * @param {number}      [position] - can be x or y coordonne
   * @returns {Function}  Return a function
   */
  function rmvPx(position) {
    let snake = this;
    return function () {
      snake.position[position] -= snake.params.speed;
    };
  }

  /**
   * The snake factory
   * @constructor
   */
  function SnakeFactory() {
    /**
     * To config the snake
     * @type {{speed: number}}
     */
    this.params = {
      speed: 3
    };
    /**
     * Style of snake
     * @type {{height: number, width: number, color: string}}
     */
    this.style = {
      height: 10,
      width: 10,
      color: '#2c2c2c'
    };
    /**
     * Init position with a random value
     * @type {{x: Number, y: Number}}
     */
    this.position = {
      x: getSnakePositionRandom(canvasXmax, this.style.width),
      y: getSnakePositionRandom(canvasYmax, this.style.height)
    };
    /**
     * Records the position of the snake head
     * @type {Array}
     */
    this.positionHistory = [];
    /**
     * Number of times where he ate an apple
     * @type {number}
     */
    this.eat = 0;
    /**
     * Allows to change the position of the snake
     * @type {{left: *, top: *, right: *, down: *}}
     */
    this.move = {
      left: rmvPx.call(this, 'x'),
      top: rmvPx.call(this, 'y'),
      right: addPx.call(this, 'x'),
      down: addPx.call(this, 'y')
    };
    /**
     * Gives a random position to the snake
     * @returns {void}
     */
    this.randomPosition = function () {
      this.position.x = getSnakePositionRandom(canvasXmax, this.style.width);
      this.position.y = getSnakePositionRandom(canvasYmax, this.style.height);
    };
    /**
     * Saves the position of the snake.
     * The last known position is recorded at the beginning of the array
     * @param {number} x - x coordonnee
     * @param {number} y - y coordonnee
     * @returns {void}
     */
    this.recordPosition = function (x, y) {
      this.positionHistory.unshift({x: x, y: y});
    };
    /**
     * Returns an array of tail
     * @returns {Array} tail - Returns an array with the positions of the tail
     */
    this.getTail = function () {
      /**
       * Stock each position of the tail
       * @type {Array}
       */
      let tail = [];
      /**
       * Interval between two positions
       * @type {number}
       */
      let step = 4;
      let j = step;
      for (let i = 0; i < this.eat; i++) {
        // When apple pop just in front of the head of sneake, positionHistory need more recording
        // eslint-disable-next-line no-undefined
        if (this.positionHistory[j] !== undefined) {
          tail.push(this.positionHistory[j]);
        }
        j += step;
      }
      // clean history with old position
      this.positionHistory.splice(j);
      return tail;
    };
    /**
     * Set eat property
     * @returns {void}
     */
    this.setEat = function () {
      this.eat += 1;
    };
    /**
     * Reload the snake
     * @returns {void}
     */
    this.reload = function () {
      this.positionHistory = [];
      this.eat = 0;
      this.randomPosition();
    };
  }
  return new SnakeFactory();
}

/**
 *  Gpu object is used to draw in the canvas
 * @param {CanvasFactory} canvas - A Canvas object
 * @param {SnakeFactory}  snake - A Snake object
 * @param {AppleFactory}  apple - A Apple object
 * @returns {GpuFactory} Return a gpu object
 */
function getGpu(canvas, snake, apple) {
  function GpuFactory() {
    /**
     * Store the context
     * @type {*}
     */
    this.ctx = canvas.ctx;
    /**
     * Draws the snake
     * @returns {void}
     */
    this.drawSnake = function () {
      this.ctx.fillStyle = snake.style.color;
      this.ctx.fillRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
    /**
     * Clear the snake
     * @returns {void}
     */
    this.clearSnake = function () {
      this.ctx.clearRect(snake.position.x, snake.position.y, snake.style.width, snake.style.height);
    };
    /**
     * Draws a apple
     * @returns {void}
     */
    this.drawApple = function () {
      this.ctx.fillStyle = apple.style.color;
      this.ctx.fillRect(apple.position.x, apple.position.y, apple.style.width, apple.style.height);
    };
    /**
     * Clear the apple
     * @returns {void}
     */
    this.clearApple = function () {
      this.ctx.clearRect(apple.position.x, apple.position.y, apple.style.width, apple.style.height);
    };
    /**
     * Draws the tails of snake
     * @returns {void}
     */
    this.drawSnakeTail = function () {
      let snakeTail = snake.getTail();
      for (let i = 0; i < snakeTail.length; i++) {
        let position = snakeTail[i];
        this.ctx.fillStyle = snake.style.color;
        this.ctx.fillRect(position.x, position.y, snake.style.width, snake.style.height);
      }
    };
    /**
     * Clear the tails of snake
     * @returns {void}
     */
    this.clearSnakeTail = function () {
      let snakeTail = snake.getTail();
      for (let i = 0; i < snakeTail.length; i++) {
        let position = snakeTail[i];
        this.ctx.clearRect(position.x, position.y, snake.style.width, snake.style.height);
      }
    };
  }
  return new GpuFactory();
}

/**
 * This object manage interactio with keyboard
 * @param {AnimationManagerFactory}   animationManager - AnimationManager object
 * @param {TimerFactory}              timer - Timer object
 * @returns {KeyboardManagerFactory}  Return a KeyboardManager object
 */
function getKeyboardManager(animationManager, timer) {
  function KeyboardManagerFactory() {
    this.firstKeydown = true;
    this.firstTimer = true;
    this.lastKeyCode = '';
    /**
     * Mapping keycode with direction
     * @type {{37: string, 38: string, 39: string, 40: string}}
     * @returns {void}
     */
    this.mapping = {37: 'left', 38: 'top', 39: 'right', 40: 'down'};
    /**
     * Check if the snake can go in the opposite direction
     * @param {number} keyCode - a keycode
     * @returns {boolean} return true or false
     */
    this.canChangeDirection = function (keyCode) {
      if (this.lastKeyCode === 37 && keyCode === 39 ) return false;
      if (this.lastKeyCode === 39 && keyCode === 37 ) return false;
      if (this.lastKeyCode === 38 && keyCode === 40 ) return false;
      if (this.lastKeyCode === 40 && keyCode === 38 ) return false;
      return true;
    };
    /**
     * Check keydown event
     * @param {number} keyCode - a keycode
     * @returns {void}
     */
    this.setKeydown = function (keyCode) {
      if (this.mapping[keyCode]) {
        if (this.firstTimer) {
          timer.run();
          this.firstTimer = false;
        }
        if (this.lastKeyCode === '' && this.firstKeydown) {
          animationManager.run(this.mapping[keyCode]);
          this.lastKeyCode = keyCode;
          this.firstKeydown = false;
        }
        if (this.canChangeDirection(keyCode)) {
          animationManager.stop();
          animationManager.run(this.mapping[keyCode]);
          this.lastKeyCode = keyCode;
        }
      }
    };
    /**
     * Relod the object and stop the animation
     * @returns {void}
     */
    this.reload = function () {
      animationManager.stop();
      this.lastKeyCode = '';
      this.firstKeydown = true;
      this.firstTimer = true;
    };
  }
  return new KeyboardManagerFactory();
}

/**
 * Collision Engine
 * @return {CollisionFactory} - return a collision object
 */
function getCollisionEngin() {
  function CollisionFactory() {
    /**
     * Test if there are a collision
     * @param {*} rect1  - a object with position x and y
     * @param {*} rect2  - a object with position x and y
     * @return {boolean} - collision or not that the question
     */
    this.hasCollision = function (rect1, rect2) {
      if (rect1.position.x < rect2.position.x + rect2.style.width && rect1.position.x + rect1.style.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.style.height && rect1.style.height + rect1.position.y > rect2.position.y) {
        return true;
      }
      return false;
    };

    /**
     * Check if a object (snake) is in the canvas
     * @param {*} snake - a object with position x and y
     * @param  {*} canvas - a object with position x and y
     * @return {boolean} - true or false
     */
    this.inCanvas = function (snake, canvas) {
      if (snake.position.x > canvas.position.x && snake.position.x + snake.style.width < canvas.style.width
      && snake.position.y > canvas.position.y && snake.position.y + snake.style.height < canvas.style.height) {
        return true;
      }
      return false;
    };
  }
  return new CollisionFactory();
}

/**
 * Use to manage animation in terms of keyboard
 * @param {GpuFactory}               gpu - a gpu object
 * @param {SnakeFactory}             snake - a snake object
 * @param {CollisionFactory}         collision - a object to compute the collision
 * @param {CanvasFactory}            canvas -  a canvas object
 * @param {AppleFactory}             apple - a apple object
 * @param {ScoreFactory}             score - a score object
 * @param {TimerFactory}             timer - a timer object
 * @returns {AnimationManagerFactory} Return a AnimationManager
 */
function getAnimationManager(gpu, snake, collision, canvas, apple, score, timer) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function AnimationManagerFactory() {
    /**
     * Stock the last id of animation frame
     * @type {number}
     */
    this.lastAnimationFrame = 0;
    /**
     * A array of functions
     * @type {Array}
     */
    this.bag = [];
    /**
     * Ratatatatatattaata
     * @return {function} buildCatling - this function is used to loop in request animation frame
     */
    this.buildCatling = function () {
      let animationManager = this;
      return function catling() {
        animationManager.bag.forEach(function (element) {
          element();
        });
        animationManager.lastAnimationFrame = window.requestAnimationFrame(catling);
      };
    };
    /**
     * The entry point of animation framme loop
     * @param  {string} direction - left, right, go see keyboardManager.mapping
     * @return {void}
     */
    this.run = function (direction) {
      let snakeMove = this.builderSnakeMove(direction);
      this.bag.push(snakeMove);
      this.lastAnimationFrame = window.requestAnimationFrame(this.buildCatling());
    };
    /**
     * Stop the animation frame
     * @return {void}
     */
    this.stop = function () {
      cancelAnimationFrame(this.lastAnimationFrame);
      this.bag = [];
    };
    /**
     * Build a snake move object
     * @param {string} direction  - check keyboardManager.mapping
     * @return {Function} - a snake move object
     */
    this.builderSnakeMove = function (direction) {
      /**
       * Build a object compatible with  Collision.hasCollision
       * @returns {{style: {width: number, height: number}}} the Object
       */
      function getTransformerTail() {
        return {
          style: {
            width: snake.style.width,
            height: snake.style.height
          }
        };
      }
      /**
       * Detect if a object touch the tail of snake
       * @param   {object}  obj - Obj can be anything, compatible with collision.hasCollision
       * @returns {boolean}     - True if touch, False if not
       */
      function collisionWithTail(obj) {
        let transformerTail = getTransformerTail();
        let tail = snake.getTail();
        for (let i = 1; i < tail.length; i++) {
          transformerTail.position = tail[i];
          if (collision.hasCollision(obj, transformerTail)) {
            return true;
          }
        }
        return false;
      }

      /**
       * Detect if a object touch the position history of snake.
       * It s used when i need to pop the apple, don t use collisionWithTail because the history is cutted
       * @param {object} obj - Obj can be anything, compatible with collision.hasCollision
       * @returns {boolean} - True if touch, False if not
       */
      function collisionWithSnakePositionHistory(obj) {
        let transformerTail = getTransformerTail();
        let tail = snake.positionHistory;
        for (let i = 1; i < tail.length; i++) {
          transformerTail.position = tail[i];
          if (collision.hasCollision(obj, transformerTail)) {
            return true;
          }
        }
        return false;
      }

      // the core of snake animation
      return function () {
        gpu.clearSnake();
        gpu.clearSnakeTail();

        if (score.isPlaying && timer.isPlaying) {
          snake.move[direction]();
          snake.recordPosition(snake.position.x, snake.position.y);
        }

        if (collision.hasCollision(snake, apple)) {
          snake.setEat();
          score.addScore();
          score.printScore();
          gpu.clearApple();
          apple.newPosition();
          // collision with head of snake
          while (collision.hasCollision(snake, apple)) {
            apple.newPosition();
          }
          // collision with tail snake
          while (collisionWithSnakePositionHistory(apple)) {
            apple.newPosition();
          }
          gpu.drawApple();
        }

        // snake se mort la queue
        if (snake.eat > 1) {
          if (collisionWithTail(snake)) {
            score.isPlaying = false;
            timer.stop();
          }
        }

        if (!collision.inCanvas(snake, canvas)) {
          timer.stop();
          score.isPlaying = false;
          gpu.drawSnake();
          gpu.drawSnakeTail();
        } else {
          gpu.drawSnake();
          gpu.drawSnakeTail();
        }
      };
    };
  }
  return new AnimationManagerFactory();
}
/**
 * Give a game object
 * @param {string} id - the css id of the score tag
 * @returns {ScoreFactory} Return a object game
 */
function getScore(id) {
  function ScoreFactory() {
    this.score = 0;
    this.step = 1;
    this.isPlaying = true;
    this.addScore = function () {
      if (this.isPlaying) {
        this.score = this.score + this.step;
      }
    };
    /**
     * function anonyme: get score tag html
     */
    this.dom = (function () {
      return document.getElementById(id);
    })();
    this.printScore = function () {
      this.dom.innerHTML = this.score;
    };
    this.reload = function () {
      this.score = 0;
      this.isPlaying = true;
      this.printScore();
    };
  }
  return new ScoreFactory();
}
/**
 * Give a timer object
 * @param {string}          id Add the id of the html tag
 * @returns {TimerFactory}  Return a Timer object
 */
function getTimer(id) {
  function TimerFactory() {
    this.params = { defaultSecond: 120};
    this.second = this.params.defaultSecond;
    this.isPlaying = true;
    this.dom = (function () {
      return document.getElementById(id);
    })();
    /**
     * Converts seconds to percent for tag
     * @return {string} return a number
     */
    this.getTimeInPercentage = function () {
      let percentage = ( this.second / this.params.defaultSecond) * 100;
      return percentage.toFixed(2);
    };
    /**
     * Print time in the progress bar tag
     * @return {void}
     */
    this.printTime = function () {
      this.dom.style.width = this.getTimeInPercentage() + '%';
    };
    this.idSetInterval = Number();
    /**
     * Run the timer
     * recursive function: call every second himself
     * @return {void}
     */
    this.run = function () {
      this.idSetInterval = setInterval(function (timer) {
        timer.second -= 1;
        if (timer.second >= 1 ) {
          timer.printTime();
        } else {
          timer.printTime();
          timer.stop();
          timer.isPlaying = false;
        }
      }, 1000, this);
    };
    /**
     * Stop the timer
     * @return {void}
     */
    this.stop = function () {
      clearInterval(this.idSetInterval);
    };
    /**
     * Reset the object
     * @return {void}
     */
    this.reload = function () {
      this.stop();
      this.isPlaying = true;
      this.second = this.params.defaultSecond;
      this.printTime();
    };
  }
  return new TimerFactory();
}

/**
 * Listening the keyboard, and lunch action
 * @param {KeyboardManagerFactory} [keyboardManager] - a KeyboardManager
 * @return {void}
 */
function listenerKeyboard(keyboardManager) {
  window.addEventListener('keydown', function (e) {
    keyboardManager.setKeydown(e.keyCode);
  });
}

/**
 * The beginning ...
 */
window.addEventListener('load', function () {
  let score = getScore('score');
  score.printScore();

  let timer = getTimer('timer');
  timer.printTime();

  let canvas = getCanvas('gamvas');
  let snake = getSnake(canvas);
  let apple = getApple(canvas);
  let gpu = getGpu(canvas, snake, apple);
  let collision = getCollisionEngin();

  gpu.drawSnake();
  while (collision.hasCollision(snake, apple)) {
    apple.newPosition();
  }
  gpu.drawApple();

  let animationManager = getAnimationManager(gpu, snake, collision, canvas, apple, score, timer);

  let keyboardManager = getKeyboardManager(animationManager, timer);

  listenerKeyboard(keyboardManager);

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
      gpu.clearSnake();
      gpu.clearSnakeTail();
      gpu.clearApple();

      snake.reload();
      apple.reload();
      score.reload();
      timer.reload();
      while (collision.hasCollision(snake, apple)) {
        apple.newPosition();
      }

      gpu.drawSnake();
      gpu.drawApple();

      keyboardManager.reload();
    }
  });
});
