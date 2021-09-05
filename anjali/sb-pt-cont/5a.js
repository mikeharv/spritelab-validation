// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/5/sublevel/1
/*
Use the new blocks in the Sprites category of the toolbox to change the size of a sprite.
Note: Sprites start with with a size of 100.
Challenge: Use events to change the size of the sprites when they are clicked.
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	starterSprite: false,
    changedSize: false,
    changedSizeEvent: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Keep track of sprites' current sizes
if(!validationProps.spritesSizes) {
  validationProps.spritesSizes = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}

if (World.frameCount == 1) {
  for (var spriteId in spriteIds) {
    var spriteSize = getProp({id: spriteId}, "scale");
    if (spriteSize != 100) {
      validationProps.successCriteria.changedSize = true;
    }
  	validationProps.spritesSizes[spriteId] = spriteSize;
  }
} else {
  // Check if new event happened
  if ((eventLog.length > validationProps.previous.eventLogLength) && !validationProps.successCriteria.changedSizeEvent) {
    var currentEvent = eventLog[eventLog.length - 1];
    // check eventLog for WhenClick or WhileClick event
    if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
      for (var spriteId in spriteIds) {
        var spriteSize = getProp({id: spriteId}, "scale");
        // check if sprite has changed size since previous frame
        if (spriteSize != validationProps.spritesSizes[spriteId]) {
          validationProps.successCriteria.changedSizeEvent = true;
          break;
        }
      }
    }
  }
}

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if ((validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.changedSize) ||
    (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.changedSizeEvent) &&
    !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

var earlyFailTime = 10;
var failTime = 150;

if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.starterSprite) {
  	levelFailure(3, "noSprites");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successTime) {
    // fail
  	levelFailure(3, "changeOrSetSize");
  } else if (validationProps.successCriteria.changedSizeEvent) {
    // bonus pass
    levelFailure(0, "genericBonusSuccess");
  } else if (validationProps.successCriteria.changedSize) {
    // pass
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