if(!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    madeFish: false,
    fishMovedX: false
  };
}

if(!validationProps.previous) {
  validationProps.previous = {
  };
}

// Constants
var failTime = 50;
var waitTime = 150;

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Was a sprite made?
if (spriteIds.length >= 1) {
  validationProps.successCriteria.madeSprite = true;
}

// Gets us all the fish sprites
if (!validationProps.fishIds) {
  validationProps.fishIds = [];
  for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({ id: spriteIds[i] }, "costume")).includes("fish")) {
      validationProps.fishIds.push(spriteIds[i]);
    }
  }
}

// Was a fish made?
validationProps.successCriteria.madeFish = (validationProps.fishIds.length >= 1);

// Get all fish locations
for (var i = 0; i < validationProps.fishIds.length; i++) {
  var fishId = validationProps.fishIds[i];
  var previous = validationProps.previous[fishId];
  var currentX = getProp({ id: validationProps.fishIds[i] }, "x");
  if (previous && previous.x != currentX) {
  	validationProps.successCriteria.fishMovedX = true;
  }
  validationProps.previous[fishId] = {x: currentX};
}

if (World.frameCount >= failTime) {
  if (!validationProps.successCriteria.madeSprite) {
    levelFailure(3, "noSprites");
  } else if (!validationProps.successCriteria.madeFish) {
    levelFailure(3, "spritelabFeedbackUseFishCostume");
  } else if (!validationProps.successCriteria.fishMovedX) {
    levelFailure(3, "spritelabFeedbackMoveFishLeftRight");
  }
}

if(World.frameCount >= waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.fishMovedX) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else {
  fill(rgb(0, 173, 188));
  rect(0, 390, (World.frameCount * 400) / waitTime, 10);
}
pop();