// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/8
/*
Add at least two other sprites to your Story Board. Give each sprite a unique costume and location!
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    differentCostumes: false,
    differentLocations: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {
  	waitTime: 120
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Check for at least 3 sprites
validationProps.successCriteria.threeSprites = spriteIds.length>=3;


if (World.frameCount == 1) {
  // Check sprite locations
  var uniqueStartingSpriteLocations = [];
  for (var i=0; i<spriteIds.length; i++) {
    var coords = [getProp({id: spriteIds[i]}, "x"), getProp({id: spriteIds[i]}, "y")];
    var noDuplicateCoords = true;
    for (var j=0; j<uniqueStartingSpriteLocations.length; j++) {
      if ((coords[0] == uniqueStartingSpriteLocations[j][0]) &&
          (coords[1] == uniqueStartingSpriteLocations[j][1])) {
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

// Check if student is interacting with the program
// version 1
for (var spriteId in spriteIds) {
  if (getProp({id: spriteId}, "timeout")>0) {
    validationProps.waitTime = World.frameCount + 60;
    break;
  } else {
    validationProps.waitTime = validationProps.previous.waitTime;
  }
}

/*
// version 2
if (validationProps.successTime && (eventLog.length > validationProps.previous.eventLogLength)) {
  validationProps.waitTime = World.frameCount + 100;
} else {
  validationProps.waitTime = validationProps.previous.waitTime;
}
*/

//validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.waitTime = validationProps.waitTime;

// Set success time if success
if (validationProps.successCriteria.threeSprites && 
    validationProps.successCriteria.differentCostumes && 
    validationProps.successCriteria.differentLocations && 
   	!validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}


var failTime = 150;
// Check criteria and give failure feedback 
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.threeSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else if (!validationProps.successCriteria.differentLocations) {
    levelFailure(3, "moveSpriteLocation");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  }
}

if (World.frameCount - validationProps.successTime >= validationProps.waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.threeSprites ||
    !validationProps.successCriteria.differentCostumes || 
    !validationProps.successCriteria.differentLocations) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/validationProps.waitTime),10);
}
pop();