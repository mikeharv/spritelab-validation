if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    uniqueCostumes: false,
    hasFood: false,
    hasPet: false,
    initialSpritesNotTouching: true,
    foodTouchedPet: false,
    petGrewByTouch: false,
    hasTouchEventBlock: false,
    spritesTouched: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper function
function checkEventLog(eventLog, eventType) {
  for (var i = 0; i < eventLog.length; i++) {
    if (eventLog[i].includes(eventType)) {
      return true;
    }
  }
  return false;
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for at least 2 sprites
if (spriteIds.length >= 2) {
  validationProps.successCriteria.twoSprites = true;
}

// Check for a draggable and non-draggable sprite
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];

  // checks if sprite is draggable
  var behaviors = getBehaviorsForSpriteId(spriteId);
  var draggable = behaviors.toString().includes("draggable");

  // if sprite draggable
  if (draggable) {
    // at least one sprite is draggable
    validationProps.successCriteria.hasFood = true;

  } else {
    // at least one sprite is not draggable
    validationProps.successCriteria.hasPet = true;
  }
}

// Checks to see if sprites are touching
if (World.frameCount == 1) {
  for (var i = 0; i < spriteIds.length; i++) {
    var outer = spriteIds[i];

    for (var j = i+1; j < spriteIds.length; j++) {
      var inner = spriteIds[j];
      
      if (isTouchingSprite({ id: outer }, { id: inner })) {
        validationProps.successCriteria.initialSpritesNotTouching = false;
      }
    }
  }
}

// Check for whenTouch event
if (checkEventLog(eventLog, "whenTouch")) {
  validationProps.successCriteria.hasTouchEventBlock = true;

  var currentEvent = eventLog[eventLog.length - 1] || "";
  var spriteId = parseInt(currentEvent.split(" ")[1]);
  var targetId = parseInt(currentEvent.split(" ")[2]);

  var spriteBehaviors = getBehaviorsForSpriteId(spriteId);
  var targetBehaviors = getBehaviorsForSpriteId(targetId);

  var spriteDraggable = spriteBehaviors.toString().includes("draggable");
  var targetDraggable = targetBehaviors.toString().includes("draggable");

  // checks that exactly one sprite in the event is draggable
  if (spriteDraggable && !targetDraggable) {
    // spriteId is the draggable sprite
    validationProps.successCriteria.foodTouchedPet = true;

    var currentScale = getProp({ id: targetId  }, "scale");
    var previous = validationProps.previous[targetId];

    if (previous && currentScale != previous) {
      validationProps.successCriteria.petGrewByTouch = true;
    }
  } else if (targetDraggable && !spriteDraggable) {
    // targetId is the draggable sprite
    validationProps.successCriteria.foodTouchedPet = true;

    var currentScale = getProp({ id: spriteId  }, "scale");
    var previous = validationProps.previous[spriteId];

    if (previous && currentScale != previous) {
      validationProps.successCriteria.petGrewByTouch = true;
    }
  }
}

// Do handshake if no whenTouch event in eventLog
if (!validationProps.successCriteria.hasTouchEventBlock) {
  // See if sprites touched
  for (var i = 0; i < spriteIds.length; i++) {
    var outer = spriteIds[i];
    var outerBehaviors = getBehaviorsForSpriteId(outer);
    var outerDraggable = outerBehaviors.toString().includes("draggable");

    // This doesn't check that one of the sprites is draggable and the other is not
    for (var j = 0; j < spriteIds.length; j++) {
      var inner = spriteIds[j];
      var innerBehaviors = getBehaviorsForSpriteId(inner);
      var innerDraggable = innerBehaviors.toString().includes("draggable");

      if (outer != inner && isTouchingSprite({ id: outer }, { id: inner })) {
        validationProps.successCriteria.spritesTouched = true;

        if (innerDraggable != outerDraggable) {
          validationProps.successCriteria.foodTouchedPet = true;
        }
      }
    }
  } 
}

// Storing sprite's scale
for (var i = 0; i < spriteIds.length; i++) {
  validationProps.previous[spriteIds[i]] = getProp({ id: spriteIds[i] }, "scale");
}

// Set success time if success
if (validationProps.successCriteria.hasFood &&
    validationProps.successCriteria.hasPet &&
    validationProps.successCriteria.initialSpritesNotTouching &&
    validationProps.successCriteria.hasTouchEventBlock && 
    validationProps.successCriteria.petGrewByTouch &&
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
  } else if (!validationProps.successCriteria.initialSpritesNotTouching) {
    console.log("To start, make sure none of your sprites are touching. Use the pin on the location block to give them different locations.");
    levelFailure(3, "startingSpritesShouldNotTouch");
  } else if (!validationProps.successCriteria.hasFood) {
    console.log("Your pet's food sprite needs to begin the `being draggable` behavior.");
    levelFailure(3, "createDraggableSprite");
  } else if (!validationProps.successCriteria.hasPet) {
    console.log("Only the food sprite should be draggable. Remove the behavior from your pet.");
    levelFailure(3, "createNotDraggableSPrite");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.spritesTouched || !validationProps.successCriteria.foodTouchedPet) {
    console.log("Drag your food sprite so it touches your pet sprite.");
    levelFailure(3, "foodNotTouchPet");
  } else if (validationProps.successCriteria.spritesTouched && !validationProps.successCriteria.hasTouchEventBlock) {
    console.log("Add a `when touching` event block and make your pet grow when it eats.");
    levelFailure(3, "addWhenTouchesEventToMakePetGrow");
  } else if (!validationProps.successCriteria.petGrewByTouch) {
    console.log("Your food and pet touched, but your pet did not grow. Add the `change size` block to the `when touching` event block for your food and pet.");
    levelFailure(3, "petNotGrowOnTouch");  
  }
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime && !mouseDown('left')) {
console.log("Generic success");
levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.hasFood ||
    !validationProps.successCriteria.hasPet ||
    !validationProps.successCriteria.initialSpritesNotTouching ||
    !validationProps.successCriteria.hasTouchEventBlock || 
    !validationProps.successCriteria.petGrewByTouch) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
