/*
Give a different fail string if cloud moved vertically but not horizontally.
*/

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: true,
    spritesHaveBehavior: false,
    sunRotated: false,
    cloudMovedX: false,
    cloudMovedY: false,
    butterflyMovedX: false,
    butterflyMovedY: false,
    bonus: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=100;

// Check for starter sprites
validationProps.successCriteria.starterSprites = (countByAnimation({costume: "sun_1"}) >= 1) && (countByAnimation({costume: "cloud_1"}) >= 1) && (countByAnimation({costume: "butterfly_1"}) >= 1);

var missingBehavior = false;
// Check for behavior (and bonus)
for (var i = 0; i < animations.length; i++) {
  if(getNumBehaviorsForAnimation(animations[i]) === 0){
    missingBehavior = true;
  }
  if(getNumBehaviorsForAnimation(animations[i]) >= 2 && getProp({id: spriteIds[i]}, "costume") == "butterfly_1") {
    validationProps.successCriteria.bonus = true;
  }
}
if(!missingBehavior){
  validationProps.successCriteria.spritesHaveBehavior = true;
}

// Check sun rotation
if(!validationProps.successCriteria.sunRotated) {
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "rotation") != 0) && (getProp({id: spriteIds[i]}, "costume") == "sun_1")) {
      validationProps.successCriteria.sunRotated = true;
    }
  }
}

//Check for updated position of cloud and butterfly
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentX = getProp({id: spriteId}, "x");
  var currentY = getProp({id: spriteId}, "y");
  var spriteCostume = getProp({id: spriteIds[i]}, "costume");
  if (previous && previous.x != currentX) {
    if (spriteCostume == "cloud_1") {
      validationProps.successCriteria.cloudMovedX = true;
    }
    if (spriteCostume == "butterfly_1") {
      validationProps.successCriteria.butterflyMovedX = true;
    }
  }
  if (previous && previous.y != currentY) {
     if (spriteCostume == "cloud_1") {
      validationProps.successCriteria.cloudMovedY = true;
    }
    if (spriteCostume == "butterfly_1") {
      validationProps.successCriteria.butterflyMovedY = true;
    }
  }
  validationProps.previous[spriteId] = {x: currentX, y: currentY};
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.starterSprites) {
    //console.log("It looks like you removed a sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.spritesHaveBehavior) {
    //console.log("Make sure all sprites have a behavior.");
    levelFailure(3, "allBehaviors");
  } else if (!validationProps.successCriteria.sunRotated) {
    //console.log("The sun didn't rotate. Try a different behavior.");
    levelFailure(3, "sunDidntRotate");
  } else if (!validationProps.successCriteria.cloudMovedX) {
    if (validationProps.successCriteria.cloudMovedY) {
      console.log("The cloud moved up and down but not left and right. Try a different behavior.");
      levelFailure(3, "cloudOnlyMovedY");	// Add feedback string
    }
    //console.log("The cloud didn't move. Try a different behavior.");
    levelFailure(3, "cloudDidntMove");
  } else if (!validationProps.successCriteria.butterflyMovedX && !validationProps.successCriteria.butterflyMovedY) {
    //console.log("The butterfly didn't move. Try a different behavior.");
    levelFailure(3, "butterflyDidntMove");
  } else if (!validationProps.successCriteria.butterflyMovedX || !validationProps.successCriteria.butterflyMovedY) {
    //console.log("The butterfly didn't wander. Try a different behavior.");	// Add feedback string
    levelFailure(3, "butterflyDidntMoveXY");
  }
}

//if we haven’t failed yet, pass
var waitTime=200;
if (World.frameCount > waitTime) {
  if(validationProps.successCriteria.bonus) {
    //console.log("Bonus");
    levelFailure(0, "genericBonusSuccess");
  } else {
    //console.log("Standard success");
  	levelFailure(0, "outbreakSuccess");
  }
}

if(!validationProps.successCriteria.starterSprites || !validationProps.successCriteria.spritesHaveBehavior ||   !validationProps.successCriteria.sunRotated || !validationProps.successCriteria.cloudMovedX || !validationProps.successCriteria.butterflyMovedX || !validationProps.successCriteria.butterflyMovedY) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
