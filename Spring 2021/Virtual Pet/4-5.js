if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    uniqueCostumes: false,
    hasPet: false,
    hasTwoDraggable: false,
    initialSpritesNotTouching: true
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

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

if (!validationProps.successCriteria.threeSprites) {
  levelFailure(3, "createAtLeastThreeSprites");
} else if (!validationProps.successCriteria.uniqueCostumes) {
  console.log("Make sure all sprites have different costumes.");
  levelFailure(3, "spritesNeedUniqueCostumes");
} else if (!validationProps.successCriteria.hasPet) {
  console.log("Only the food sprite should be draggable. Remove the behavior from your pet.");
  levelFailure(3, "createNotDraggableSPrite");
} else if (!validationProps.successCriteria.hasTwoDraggable) {
  console.log("Your pet's food and friend sprite need to begin the `being draggable` behavior.");
  levelFailure(3, "createTwoDraggableSprites");
} else if (!validationProps.successCriteria.initialSpritesNotTouching) {
  console.log("To start, make sure none of your sprites are touching. Use the pin on the location block to give them different locations.");
  levelFailure(3, "startingSpritesShouldNotTouch");
} else {
  levelFailure(0, "genericSuccess");
}