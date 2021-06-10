if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    uniqueCostumes: false,
    hasPet: false,
    hasTwoDraggable: false,
    initialSpritesNotTouching: true,
    toyTouchedPet: false,
    petBeginNewBehaviorByTouch: false,
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

// Helper function to check if a new behavior was added
function addedNewBehavior(prevBehaviors, currBehaivors) {
  for (var i = 0; i < currBehaivors.length; i++) {
    var currentBehavior = currBehaivors[i];
    if (prevBehaviors && !prevBehaviors.toString().includes(currentBehavior)) {
      // a current behavior is not in the previous behavior list
      return true;
    }
  }
  return false;
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();
var eventLog = getEventLog();

// Check for at least 3 sprites
if (spriteIds.length >= 3) {
  validationProps.successCriteria.threeSprites = true;
}

// Check for all sprites having unique costumes
if (spriteIds.length == animations.length) {
  validationProps.successCriteria.uniqueCostumes = true;
}

var numDraggable = 0;
var numNotDraggable = 0;

// Check behavior for draggable
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];

  // checks if sprite is draggable
  var behaviors = getBehaviorsForSpriteId(spriteId);
  var draggable = behaviors.toString().includes("draggable");

  if (draggable) {
    numDraggable++;
  } else {
    numNotDraggable++;
  }
}

// Check for at least 1 non-draggable sprite
if (numNotDraggable >= 1) {
  validationProps.successCriteria.hasPet = true;
}

// Check for at least 2 draggable sprites
if (numDraggable >= 2) {
  validationProps.successCriteria.hasTwoDraggable = true;
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
    validationProps.successCriteria.toyTouchedPet = true;

    var previous = validationProps.previous[targetId];

    if (addedNewBehavior(previous, targetBehaviors)) {
      validationProps.successCriteria.petBeginNewBehaviorByTouch = true;
    }
  } else if (targetDraggable && !spriteDraggable) {
    // targetId is the draggable sprite
    validationProps.successCriteria.toyTouchedPet = true;

    var previous = validationProps.previous[spriteId];

    if (addedNewBehavior(previous, spriteBehaviors)) {
      validationProps.successCriteria.petBeginNewBehaviorByTouch = true;
    }
  }
}

// Checks to see if sprites are initially touching
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
          // this might be wrong since the toy OR the food can be draggable
          validationProps.successCriteria.toyTouchedPet = true;
        }
      }
    }
  } 
}

// Storing sprite's behavior list
for (var i = 0; i < spriteIds.length; i++) {
  validationProps.previous[spriteIds[i]] = getBehaviorsForSpriteId(spriteIds[i]);
}

// Set success time if success
if (validationProps.successCriteria.hasPet&&
    validationProps.successCriteria.hasTwoDraggable &&
    validationProps.successCriteria.initialSpritesNotTouching &&
    validationProps.successCriteria.hasTouchEventBlock && 
    validationProps.successCriteria.petBeginNewBehaviorByTouch &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.threeSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else if (!validationProps.successCriteria.uniqueCostumes) {
    console.log("Make sure all sprites have different costumes.");
    levelFailure(3, "spritesNeedUniqueCostumes");
  } else if (!validationProps.successCriteria.hasPet) {
    console.log("Only some of the sprites in this project will be dragable. Remove the draggable behavior from your pet.");
    levelFailure(3, "createNotDraggableSPrite");
  } else if (!validationProps.successCriteria.hasTwoDraggable) {
    console.log("Your pet's food and friend sprite need to begin the `being draggable` behavior.");
    levelFailure(3, "createTwoDraggableSprites");
  } else if (!validationProps.successCriteria.initialSpritesNotTouching) {
    console.log("To start, make sure none of your sprites are touching. Use the pin on the location block to give them different locations.");
    levelFailure(3, "startingSpritesShouldNotTouch");
  } 
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.spritesTouched || !validationProps.successCriteria.toyTouchedPet) {
    console.log("Drag your new sprite so it touches your pet sprite.");
    levelFailure(3, "toyNotTouchPet");
  } else if (validationProps.successCriteria.spritesTouched && !validationProps.successCriteria.hasTouchEventBlock) {
    console.log("Add a `when touching` event block and make your pet begin a new behavior.");
    levelFailure(3, "addWhenTouchesEventToBeginNewBehavior");
  } else if (!validationProps.successCriteria.petBeginNewBehaviorByTouch) {
    // Need to chnage feedback string
    console.log("Use a `sprite begins` block to give your pet a new behavior *when the new sprite touches it.*");
    levelFailure(3, "petNotBeginNewBehaviorOnTouch");  
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
if (!validationProps.successCriteria.hasPet ||
    !validationProps.successCriteria.hasTwoDraggable ||
    !validationProps.successCriteria.initialSpritesNotTouching ||
    !validationProps.successCriteria.hasTouchEventBlock || 
    !validationProps.successCriteria.petBeginNewBehaviorByTouch) 
{
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
