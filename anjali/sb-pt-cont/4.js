// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/4
/*
Let’s make a sprite say something when you click on it!
Do This:
Use an event and the say block to make a sprite say something when it is clicked.
After pressing the Run button, click or tap the sprites to have them say something.
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    noSpritesTouching: true,
    differentLocations: false,
    differentCostumes: false,
    clickedSprite: false,
    spriteClickCausesSpeech: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for at least 1 sprite
validationProps.successCriteria.starterSprite = spriteIds.length>=1;

if (World.frameCount == 1) {
  // Check that no sprites are touching
  if (World.frameCount == 1) {
    for (var i=0; i<spriteIds.length; i++) {
      for (var j=i+1; j<spriteIds.length; j++) {
        if (isTouchingSprite({id: spriteIds[i]}, {id: spriteIds[j]})) {
          validationProps.successCriteria.noSpritesTouching = false;
          break;
        }
      }
      if (!validationProps.successCriteria.noSpritesTouching) {
        break;
      }
    }
  }
  
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

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  var currentEvent = eventLog[eventLog.length - 1];
  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    // current event is a click
    validationProps.successCriteria.clickedSprite = true;
    for (var spriteId in spriteIds) {
      if (getProp({id: spriteId}, "speech") && getProp({id: spriteId}, "timeout")==120) {
        // new sprite caused speech in some sprite
        validationProps.successCriteria.spriteClickCausesSpeech = true;
        break;
      }
    }
  }
}

// Store previous event log and print log lengths
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.noSpritesTouching &&
    validationProps.successCriteria.differentLocations &&
    validationProps.successCriteria.differentCostumes &&
    validationProps.successCriteria.clickedSprite && 
    validationProps.successCriteria.spriteClickCausesSpeech &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "noSprites");
  } else if (!validationProps.successCriteria.noSpritesTouching) {
    levelFailure(3, "startingSpritesShouldNotTouch");
  } else if (!validationProps.successCriteria.differentLocations) {
    levelFailure(3, "moveSpriteLocation");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.clickedSprite) {
    levelFailure(3, "singleSpriteNotClicked");
  } else if (!validationProps.successCriteria.spriteClickCausesSpeech) {
	levelFailure(3, "clickButNoSay");
  }
}

// Pass 5 seconds after success
var waitTime = 150;
if (World.frameCount - validationProps.successTime >= waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite ||
    !validationProps.successCriteria.noSpritesTouching ||
   	!validationProps.successCriteria.differentLocations ||
    !validationProps.successCriteria.differentCostumes) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/earlyFailTime),10);
} else if (!validationProps.successCriteria.clickedSprite ||
    !validationProps.successCriteria.spriteClickCausesSpeech) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
pop();