// Set up canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Set up character
const character = {
  x: 0,
  y: 0,
  size: 50,
  color: "red",
  speed: 3,
  acceleration: 0.1,
  deceleration: 0.1,
  maxSpeed: 5,
  velocityX: 0,
  velocityY: 0,
  friction: 0.95,
  gravity: 0.5,
  jumpStrength: 10,
  jumping: false,
};

// Set up ground
const ground = {
    x: 10,
    y: 10,
    width: 500,
    height: 500,
    color: "green",
  };
 
 
// Set up isometric projection variables
const projectionCenterX = canvas.width / 2;
const projectionCenterY = canvas.height / 2;
const projectionAngleX = Math.PI / 1;
const projectionAngleY = -Math.PI / 1;
const projectionScaleX = 1;
const projectionScaleY = 0.5;


// Apply isometric projection to canvas
const applyProjection = () => {
    ctx.save();
  
    ctx.translate(projectionCenterX, projectionCenterY);
    ctx.rotate(projectionAngleX);
    ctx.scale(projectionScaleX, projectionScaleY);
    ctx.rotate(projectionAngleY);
    ctx.translate(-projectionCenterX, -projectionCenterY);
  };


// Handle keyboard input
// Handle keyboard input
document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        if (!character.jumping) {
          character.velocityY -= character.jumpStrength;
          character.jumping = true;
        }
        break;
      case "ArrowDown":
      case "s":
        character.velocityY += character.acceleration;
        break;
      case "ArrowLeft":
      case "a":
        character.velocityX -= character.acceleration;
        break;
      case "ArrowRight":
      case "d":
        character.velocityX += character.acceleration;
        break;
    }
  });
  
  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        character.velocityY += character.deceleration;
        break;
      case "ArrowDown":
      case "s":
        character.velocityY -= character.deceleration;
        break;
      case "ArrowLeft":
      case "a":
        character.velocityX += character.deceleration;
        break;
      case "ArrowRight":
      case "d":
        character.velocityX -= character.deceleration;
        break;
    }
  });
  
  // Update character position
  const updateCharacter = () => {
    // Apply velocity to character position
    character.x += character.velocityX;
    character.y += character.velocityY;
  
    // Apply friction to velocity
    character.velocityX *= character.friction;
    character.velocityY *= character.friction;
  
    // Apply gravity to velocity
    //character.velocityY += character.gravity;
  
    // Limit velocity to maximum speed
    character.velocityX = Math.min(character.velocityX, character.maxSpeed);
    character.velocityX = Math.max(character.velocityX, -character.maxSpeed);
    character.velocityY = Math.min(character.velocityY, character.maxSpeed);
    character.velocityY = Math.max(character.velocityY, -character.maxSpeed);
};

  
// Draw character on canvas
const drawCharacter = () => { 
    applyProjection();
    // Draw character
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.size, character.size);
    
    ctx.restore();
  };


  
// Draw ground on canvas
const drawGround = () => {
    ctx.save();
  
    applyProjection();
    // Draw ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
  
    ctx.restore();
  };



// Update and draw canvas
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCharacter();
  drawGround();
  drawCharacter();

  requestAnimationFrame(draw);
};

draw();