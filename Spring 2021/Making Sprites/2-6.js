if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	madeTwoSprites: false,
    changedSize: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Checks for two sprites
validationProps.successCriteria.madeTwoSprites = (spriteIds.length >= 2);

// Check for how many sprites changed size
var currentNumChangedSize = 0;
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "scale") != 100) {
  	currentNumChangedSize++;
  }
}
validationProps.successCriteria.changedSize = (currentNumChangedSize >= 2);

// Check criteria and give failure feedback
if (!validationProps.successCriteria.madeTwoSprites) {
  levelFailure(3, "starterSprites");
} else if (!validationProps.successCriteria.changedSize) {
  levelFailure(3, "useTwoSetpropBlocks");
} else {
  levelFailure(0, "genericSuccess");
}
