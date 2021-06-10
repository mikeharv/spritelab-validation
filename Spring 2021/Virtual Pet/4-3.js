if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    twoSprites: false,
    hasDraggableSprite: false,
    hasNotDraggableSprite: false,
    draggableSpriteMovedByDrag: false,
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Check for at least 2 sprites
if (spriteIds.length >= 2) {
  validationProps.successCriteria.twoSprites = true;
}

// Check behavior for draggable and get location of each sprite
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentX = getProp({ id: spriteId }, "x");
  var currentY = getProp({ id: spriteId }, "y");

  // checks if sprite is draggable
  var behaviors = getBehaviorsForSpriteId(spriteId);
  var draggable = behaviors.toString().includes("draggable");

  if (previous) {
    // if sprite draggable
    if (draggable) {
      // at least one sprite is draggable
      validationProps.successCriteria.hasDraggableSprite = true;

      // check if location changed
      if ((previous.x != currentX || previous.y != currentY) && mouseDown('left')) {
        validationProps.successCriteria.draggableSpriteMovedByDrag = true;
      }
    } else {
      // at least one sprite is not draggable
      validationProps.successCriteria.hasNotDraggableSprite = true;
    }
  }

  validationProps.previous[spriteId] = {x: currentX, y: currentY};
}

// Set success time if success
if (validationProps.successCriteria.hasDraggableSprite &&
    validationProps.successCriteria.hasNotDraggableSprite &&
    validationProps.successCriteria.draggableSpriteMovedByDrag &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.twoSprites) {
    console.log("You need to have two sprites. Make two sprites under the `when run` block.");
  	levelFailure(3, "createAtLeastTwoSprites");
  } else if (!validationProps.successCriteria.hasDraggableSprite) {
    console.log("Your pet's food sprite needs to begin the `being draggable` behavior.");
    levelFailure(3, "createDraggableSprite");
  } else if (!validationProps.successCriteria.hasNotDraggableSprite) {
    console.log("Only the food sprite should be draggable. Remove the behavior from your pet.");
    levelFailure(3, "createNotDraggableSPrite");
  }
}

if (World.frameCount > failTime && !validationProps.successCriteria.draggableSpriteMovedByDrag) {
  console.log("Your code looks great! To drag your sprite, click on it while the program runs.");
  levelFailure(3, "moveSpriteByDrag");
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime && !mouseDown('left')) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.hasDraggableSprite ||
    !validationProps.successCriteria.hasNotDraggableSprite ||
    !validationProps.successCriteria.draggableSpriteMovedByDrag) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
