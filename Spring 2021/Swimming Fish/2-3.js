if(!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    madeFish: false,
    fishHasBehavior: false
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

// Gets all the fish sprites
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

// Does at least one fish have a behavior?
for(var i=0; i < animations.length; i++){
  if(animations[i].includes("fish")){
    if(getNumBehaviorsForAnimation(animations[i]) >= 1){
      validationProps.successCriteria.fishHasBehavior=true;
    }
  }
}

if(World.frameCount >= failTime) {
  if(!validationProps.successCriteria.madeSprite){
    levelFailure(3, "noSprites");
  } else if(!validationProps.successCriteria.madeFish) {
    levelFailure(3, "spritelabFeedbackUseFishCostume");
  } else if(!validationProps.successCriteria.fishHasBehavior) {
    levelFailure(3, "spritelabFeedbackCreateFishWithBehavior");
  }
}

if(World.frameCount >= waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.madeSprite || !validationProps.successCriteria.madeFish || !validationProps.successCriteria.fishHasBehavior) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else {
  fill(rgb(0, 173, 188));
  rect(0, 390, (World.frameCount * 400) / waitTime, 10);
}
pop();
