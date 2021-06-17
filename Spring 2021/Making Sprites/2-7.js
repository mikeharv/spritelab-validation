if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    spriteHasBehavior: false,
    bonus: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=10;

// Check for sprites
if (!validationProps.successCriteria.madeSprite) {
  validationProps.successCriteria.madeSprite = (spriteIds.length >= 1);
}


// Check for behavior
if (validationProps.successCriteria.madeSprite) {
  for (var i = 0; i < animations.length; i++) {
    if(getNumBehaviorsForAnimation(animations[i]) >= 1){
      validationProps.successCriteria.spriteHasBehavior = true;
    }
    if(getNumBehaviorsForAnimation(animations[i]) >= 2){
      validationProps.successCriteria.bonus = true;
    }
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.madeSprite) {
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.spriteHasBehavior) {
    levelFailure(3, "noBehavior");
  }
}

//if we haven’t failed yet, pass
var waitTime=150;
if (World.frameCount > waitTime) {
  if(validationProps.successCriteria.bonus){
    levelFailure(0, "genericBonusSuccess");
  } else {
  	levelFailure(0, "genericExplore");
  }
}

if(!validationProps.successCriteria.madeSprite || !validationProps.successCriteria.spriteHasBehavior) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
