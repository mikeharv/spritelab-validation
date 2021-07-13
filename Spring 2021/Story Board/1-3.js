if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    twoSprites: false,
    differentLocations: false,
    differentCostumes: false
  };
}

//Helper variables
var spriteIds = getSpriteIdsInUse();

//Count Sprites
validationProps.successCriteria.twoSprites = spriteIds.length>=2;

//Check sprite locations
if(validationProps.successCriteria.twoSprites){
  if (getProp({id: spriteIds[0]}, "x")!=getProp({id: spriteIds[1]}, "x") || getProp({id: spriteIds[0]}, "y")!=getProp({id: spriteIds[1]}, "y")) {
    validationProps.successCriteria.differentLocations=true;
  }
}

//Check sprite costumes
if(validationProps.successCriteria.twoSprites){
  if (getProp({id: spriteIds[0]}, "costume")!=getProp({id: spriteIds[1]}, "costume")) {
    validationProps.successCriteria.differentCostumes=true;
  }
}

// Set success time if success
if (validationProps.successCriteria.twoSprites &&
    validationProps.successCriteria.differentLocations &&
    validationProps.successCriteria.differentCostumes &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 10;

//Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.twoSprites) {
    levelFailure(3, "createAtLeastTwoSprites");
  } else if (!validationProps.successCriteria.differentLocations) {
    levelFailure(3, "changeLocation");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  }
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime) {
  levelFailure(0, "genericExplore");
}

push();
stroke("white");
if (!validationProps.successCriteria.twoSprites ||
    !validationProps.successCriteria.differentLocations ||
    !validationProps.successCriteria.differentCostumes) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
