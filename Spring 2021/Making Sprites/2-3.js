if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprites: false,
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Count Sprites
if(!validationProps.successCriteria.madeSprites){
  validationProps.successCriteria.madeSprites = (spriteIds.length >= 1);
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.madeSprites) {
  levelFailure(3, "noSprites");
} else {
  levelFailure(0, "genericSuccess");
}
