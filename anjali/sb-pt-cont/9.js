// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/9
/*
Update your code so that clicking each sprite causes some sprite to say something. Be sure whatever text you type is safe to share!
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    differentCostumes: false,
    differentLocations: false,
    noSpritesTouching: true,
    numSpritesClicked: 0,
    numSpriteClicksCauseSpeech: 0
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

if (!validationProps.previous) {
  validationProps.previous = {
    waitTime: 210,
    numStartingSprites: spriteIds.length
  };
}

// Check for at least 3 different sprites
validationProps.successCriteria.threeSprites = spriteIds.length>=3;

// When program starts
if (World.frameCount == 1) {
  // Check that no sprites are touching
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

// Keeps track of which sprites were clicked on
if(!validationProps.spritesClickedOn) {
  validationProps.spritesClickedOn = [];
}

// Keeps track of which sprites caused speech on click
if(!validationProps.spriteClicksCauseSpeech) {
  validationProps.spriteClicksCauseSpeech = [];
}

// Helper function
// returns true if spriteId is in spriteIdArray
function member(spriteId, spriteIdArray) {
  for (var i = 0; i < spriteIdArray.length; i++) {
    if (spriteIdArray[i] == spriteId) {
      return true;
    }
  }
  return false;
}

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  // check eventLog for WhenClick or WhileClick event
  var currentEvent = eventLog[eventLog.length - 1];

  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    // current event is a click
    var clickedSpriteId = parseInt(currentEvent.split(" ")[1]);
    validationProps.spritesClickedOn.push(clickedSpriteId);
    validationProps.successCriteria.numSpritesClicked = validationProps.spritesClickedOn.length;
    if (!member(clickedSpriteId, validationProps.spriteClicksCauseSpeech)) {
      var newSpriteSpeaking = false;
      for (var spriteId in spriteIds) {
        if (getProp({id: spriteId}, "speech") && getProp({id: spriteId}, "timeout")==120) {
          // new sprite caused speech in some sprite
          newSpriteSpeaking = true;
          break;
        }
      }
      if (newSpriteSpeaking) {
        validationProps.spriteClicksCauseSpeech.push(clickedSpriteId);
      	validationProps.successCriteria.numSpriteClicksCauseSpeech = validationProps.spriteClicksCauseSpeech.length;
      }
    }
  }
}

// Store previous values
validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.waitTime = validationProps.waitTime;

// Set success time if success
if (validationProps.successCriteria.threeSprites &&
    validationProps.successCriteria.differentCostumes &&
    validationProps.successCriteria.differentLocations &&
    validationProps.successCriteria.noSpritesTouching &&
    validationProps.successCriteria.numSpritesClicked>=validationProps.previous.numStartingSprites &&
    validationProps.successCriteria.numSpriteClicksCauseSpeech==validationProps.previous.numStartingSprites &&
    !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 210;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.threeSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  } else if (!validationProps.successCriteria.differentLocations) {
    levelFailure(3, "moveSpriteLocation");
  } else if (!validationProps.successCriteria.noSpritesTouching) {
    levelFailure(3, "startingSpritesShouldNotTouch");
  }
}

if (World.frameCount > failTime) {
  if (validationProps.successCriteria.numSpritesClicked == 0) {
    // did not click on any sprite
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 0) {
    // student clicked on a sprite, but the click did not cause speech
    levelFailure(3, "clickButNoSpeech");
  } else if (validationProps.successCriteria.numSpritesClicked == 1) {
    // did not click on 2 or 3 sprites
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 1) {
    // student clicked on a second sprite, but the second click did not cause speech
    levelFailure(3, "secondClickButNoSpeech");
  } else if (validationProps.successCriteria.numSpritesClicked == 2) {
    // did not click on 3 sprites
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 2) {
    // student clicked on a third sprite, but the third click did not cause speech
    levelFailure(3, "thirdClickButNoSpeech");
  } 
}

if (World.frameCount - validationProps.successTime >= validationProps.waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.threeSprites ||
    !validationProps.successCriteria.differentCostumes ||
    !validationProps.successCriteria.differentLocations ||
    !validationProps.successCriteria.noSpritesTouching) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/earlyFailTime),10);
} else if (validationProps.successCriteria.numSpriteClicksCauseSpeech<validationProps.previous.numStartingSprites) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/validationProps.waitTime),10);
}
pop();