import Phaser from 'phaser';
import PlayScene from './Scenes/PlayScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const config = {
  // Auto defaults to WebGL
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [new PlayScene(SHARED_CONFIG)]
}

// ------------------------- VARIABLES -------------------------

// ------------------------- Pipe Config -----------------------
const VELOCITY = 200;
const PIPES_TO_RENDER = 4;
const pipeOpeningRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 500];

let pipeHorizontalDistance = 0;
let pipes = null;
// ------------------------- Pipe Config -----------------------

// ------------------------- Bird Config -----------------------
let bird = null;

const flapVelocity = 250;
const initialBirdPosition = {x: config.width * 0.1, y: config.height / 2};
// ------------------------- Bird Config -----------------------

// ------------------------- VARIABLES -------------------------


function preload() {

  this.load.image('sky', 'assets/sky2.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');

}

function create() {
  //Background
  this.add.image(0, 0, 'sky').setOrigin(0,0);

  //Bird
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  //Pipes
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++)
  {    
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
  
    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  //Input Events
  this.input.on('pointerdown', Flap);
  this.input.keyboard.on('keydown_SPACE', Flap);
  this.input.keyboard.on('keydown_J', Flap);
}

function update(time, delta)
{
  if (bird.y > config.height || bird.y < 0 - bird.height) {
    restartBirdPosition();
  } 

  recyclePipes();
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}

function restartBirdPosition()
{
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function placePipe(uPipe, lPipe) 
{
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeOpeningRange);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance

}

function getRightMostPipe()
{
  let rightMostX = 0;

  pipes.getChildren().forEach(function(pipe){ 
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
}

function Bounce()
{
  if (bird.body.position.x >= config.width - 30)
  {
    bird.body.velocity.x = -VELOCITY;
  }
  else if (bird.body.position.x <= 0)
  {
    bird.body.velocity.x = VELOCITY;
  }
}

function Flap()
{
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);