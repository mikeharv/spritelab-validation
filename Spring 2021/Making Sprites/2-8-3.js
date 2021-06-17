if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    spriteGoodPosition: false,
	spriteMovedOff: false,
    spriteHasBehavior: false,
    bonus: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=100;

// Check for sprites
validationProps.successCriteria.madeSprite = (animations.length >= 1);

// Check sprite position to be above the water
if(!validationProps.successCriteria.spriteGoodPosition){
  for (var i = 0; i < spriteIds.length; i++) {
    if (getProp({id: spriteIds[i]}, "y") > 250) {
      validationProps.successCriteria.spriteGoodPosition = true;
    }
  }
}

// Check that sprite left the screen
if(!validationProps.successCriteria.spriteMovedOff){
for (var i = 0; i < spriteIds.length; i++) {
    if (getProp({id: spriteIds[i]}, "x") > 410 || getProp({id: spriteIds[i]}, "x") < -10) {
      validationProps.successCriteria.spriteMovedOff = true;
    }
  }
}

// Check for behavior
var behaviorFound=false;
for (var i = 0; i < animations.length; i++) {
  if(getNumBehaviorsForAnimation(animations[i]) >= 1){
    validationProps.successCriteria.spriteHasBehavior = true;  
  }
  if(getNumBehaviorsForAnimation(animations[i]) >= 2){
    validationProps.successCriteria.bonus = true;
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.madeSprite) {
    levelFailure(3, "noSprites");
  } else if (!validationProps.successCriteria.spriteGoodPosition) {
    levelFailure(3, "shipBadPosition");
  } else if (!validationProps.successCriteria.spriteHasBehavior) {
    levelFailure(3, "noBehavior");
  } else if (!validationProps.successCriteria.spriteMovedOff) {
    levelFailure(3, "shipStayedInBounds");
  } 
}

//if we haven’t failed yet, pass
var waitTime=150;
if (World.frameCount > waitTime) {
  if(validationProps.successCriteria.bonus){
    levelFailure(0, "genericBonusSuccess");
  } else {
  	levelFailure(0, "outbreakSuccess");
  }
}

if(!validationProps.successCriteria.madeSprite || !validationProps.successCriteria.spriteGoodPosition ||
   !validationProps.successCriteria.spriteMovedOff || !validationProps.successCriteria.spriteHasBehavior){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
