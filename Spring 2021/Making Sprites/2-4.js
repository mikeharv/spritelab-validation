if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    movedSprite: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check for sprites
if (!validationProps.successCriteria.madeSprite) {
  validationProps.successCriteria.madeSprite = (animations.length >= 1);
}

// Check sprite position
if (!validationProps.successCriteria.movedSprite) {
  for (var i = 0; i < spriteIds.length; i++) {
	if ((getProp({id: spriteIds[i]}, "x") != 200) || (getProp({id: spriteIds[i]}, "y") != 200)) {
      validationProps.successCriteria.movedSprite = true;
    }
  }
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.madeSprite) {
    levelFailure(3, "noSprites");
} else if (!validationProps.successCriteria.movedSprite) {
    levelFailure(3, "changeLocation");
} else {
  levelFailure(0, "genericSuccess");
}
