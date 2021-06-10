if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    twoSprites: false,
    differentCostumes: false,
    initialSpritesNotTouching: true,
    spriteChangedSize: false,
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check for at least 2 sprites
if (spriteIds.length >= 2) {
  validationProps.successCriteria.twoSprites = true;
}

// Check for sprite costumes
if (animations.length >= 2) {
  validationProps.successCriteria.differentCostumes = true;
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

// check for size change
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var scale = getProp({ id: spriteId }, "scale");

  if (scale != 100) {
    validationProps.successCriteria.spriteChangedSize = true;
  }
}

if (!validationProps.successCriteria.twoSprites) {
  levelFailure(3, "createAtLeastTwoSprites");
} else if (!validationProps.successCriteria.differentCostumes) {
  levelFailure(3, "spritelabFeedbackCreateTwoDifferentSprites");
} else if (!validationProps.successCriteria.initialSpritesNotTouching) {
  console.log("To start, make sure none of your sprites are touching. Use the pin on the location block to give them different locations.");
  levelFailure(3, "startingSpritesShouldNotTouch");
} else if (!validationProps.successCriteria.spriteChangedSize) {
  levelFailure(3, "useSetpropBlock");
} else {
  levelFailure(0, "genericSuccess");
}
