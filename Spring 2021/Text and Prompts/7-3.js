if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    twoSprites: false,
    differentLocations: false
  };
}

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Count Sprites
if(!validationProps.successCriteria.twoSprites){
  validationProps.successCriteria.twoSprites = spriteIds.length >= 2;
}

//Check sprite locations
if(validationProps.successCriteria.twoSprites){
  if (getProp({id: spriteIds[0]}, "x")!=getProp({id: spriteIds[1]}, "x") || getProp({id: spriteIds[0]}, "y")!=getProp({id: spriteIds[1]}, "y")) {
    validationProps.successCriteria.differentLocations=true;
  }
}


  // Check criteria and give failure feedback
if (!validationProps.successCriteria.twoSprites) {
  levelFailure(3, "moreSprites");
} else if (!validationProps.successCriteria.differentLocations) {
  levelFailure(3, "changeLocation");
} else {
  levelFailure(0, "genericExplore");
}
