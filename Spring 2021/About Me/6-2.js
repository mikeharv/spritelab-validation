if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Check for at least 3 sprites
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

// Check criteria for failure / success
if (!validationProps.successCriteria.starterSprite) {
  levelFailure(3, "noSprites");
} else {
  levelFailure(0, "genericSuccess");
}