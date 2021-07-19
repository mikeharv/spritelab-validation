// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/3
/*
Make two sprites with different costumes and different locations. Use the pin on the location block to move sprites to different locations.
*/
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

if (World.frameCount == 1) {
  // Check sprite locations
  var uniqueStartingSpriteLocations = [];
  for (var i=0; i<spriteIds.length; i++) {
    var coords = [getProp({id: spriteIds[i]}, "x"), getProp({id: spriteIds[i]}, "y")];
    console.log("coords for " + spriteIds[i] + ": " + coords);
    var noDuplicateCoords = true;
    for (var j=0; j<uniqueStartingSpriteLocations.length; j++) {
      if ((coords[0] == uniqueStartingSpriteLocations[j][0]) &&
          (coords[1] == uniqueStartingSpriteLocations[j][1])){
        noDuplicateCoords = false;
        break;
      }
    }
    if (!noDuplicateCoords) {
      break;
    } else {
      uniqueStartingSpriteLocations.push(coords);
    }
  }
  if (spriteIds.length == uniqueStartingSpriteLocations.length) {
    validationProps.successCriteria.differentLocations = true;
  }

  // Check sprite costumes
  var uniqueStartingSpriteCostumes = [];
  for (var i=0; i<spriteIds.length; i++) {
    var costume = getProp({id: spriteIds[i]}, "costume");
    var noDuplicateCostumes = true;
    for (var j=0; j<uniqueStartingSpriteCostumes.length; j++) {
      if (costume == uniqueStartingSpriteCostumes[j]) {
        noDuplicateCostumes = false;
        break;
      }
    }
    if (!noDuplicateCostumes) {
      break;
    } else {
      uniqueStartingSpriteCostumes.push(costume);
    }
  }
  if (spriteIds.length == uniqueStartingSpriteCostumes.length) {
    validationProps.successCriteria.differentCostumes = true;
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
    levelFailure(3, "moveSpriteLocation");
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