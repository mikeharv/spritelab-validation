if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	starterSprite: false,
    spriteCreated: false,
    multipleSpritesCreated: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}

// Check if new event happened
if ((eventLog.length > validationProps.previous.eventLogLength) && 
    !(validationProps.successCriteria.spriteCreated && 
    validationProps.successCriteria.multipleSpritesCreated)) {
  var currentEvent = eventLog[eventLog.length - 1];
  // check eventLog for WhenClick or WhileClick event
  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    if (spriteIds.length == validationProps.previous.spriteIdsLength + 1) {
      validationProps.successCriteria.spriteCreated = true;
    } else if (spriteIds.length > validationProps.previous.spriteIdsLength + 1) {
      var newSpriteLocations = [];
      for (var i=validationProps.previous.spriteIdsLength; i<spriteIds.length; i++) {
        var spriteCoordinates = getProp({id: spriteIds[i]}, "x") + ":" + getProp({id: spriteIds[i]}, "y");
        if (newSpriteLocations.indexOf(spriteCoordinates) == -1) {
          newSpriteLocations.push(spriteCoordinates);
        }
      }
      if (newSpriteLocations.length == (spriteIds.length - validationProps.previous.spriteIdsLength)) {
      	validationProps.successCriteria.multipleSpritesCreated = true;
      } else {
        validationProps.successCriteria.spriteCreated = true;
      }
    }
  }
}

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.spriteIdsLength = spriteIds.length;

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
    (validationProps.successCriteria.spriteCreated || 
     validationProps.successCriteria.multipleSpritesCreated) &&
    !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

var earlyFailTime = 10;
var failTime = 150;

if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.starterSprite) {
    console.log("You need to make a sprite.");
  	levelFailure(3, "noSprites");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successTime) {
    console.log("You need to make more sprites.");
  	levelFailure(3, "moreSprites");
  } else if (validationProps.successCriteria.multipleSpritesCreated) {
    console.log("Great job! You've finished the level, including the extra challenge!");
    levelFailure(0, "genericBonusSuccess");
  } else if (validationProps.successCriteria.spriteCreated) {
    console.log("Generic success");
    levelFailure(0, "genericSuccess");
  }
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/earlyFailTime),10);
} else if (!validationProps.successTime) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount)*400/failTime),10);
}
pop();
