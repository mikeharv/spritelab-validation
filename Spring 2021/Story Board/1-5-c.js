if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    changedBackground: false,
    changedBackgroundEvent: false
  };
}

if (!validationProps.previous) {
  if(validationProps.background){
    validationProps.previous = {
      background: validationProps.background
    };
  }
  else {
    validationProps.previous = {
      background: getBackground()
    };
  }
}
/*
// Keep track of current background
if(!validationProps.currBackground) {
  validationProps.currBackground = getBackground();
} */

console.log("background: " + validationProps.previous.background);

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}
/*
if (World.frameCount == 1) {
  for (var spriteId in spriteIds) {
    var spriteSize = getProp({id: spriteId}, "scale");
    if (spriteSize != 100) {
      validationProps.successCriteria.changedSize = true;
    }
  	validationProps.spritesSizes[spriteId] = spriteSize;
  }
} else {
  */
// Check if new event happened
if ((eventLog.length > validationProps.previous.eventLogLength) && !validationProps.successCriteria.changedBackgroundEvent) {
  var currentEvent = eventLog[eventLog.length - 1];
  // check eventLog for WhenClick or WhileClick event
  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    if (getBackground() != validationProps.previous.background) {
      validationProps.successCriteria.changedBackgroundEvent = true;
    }
  }
}
//}

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if ((validationProps.successCriteria.starterSprite &&
     validationProps.successCriteria.changedBackground) ||
    (validationProps.successCriteria.starterSprite &&
     validationProps.successCriteria.changedBackgroundEvent) &&
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
    // fail
    console.log("The background was not changed.");
    levelFailure(3, "changeBackground");
  } else if (validationProps.successCriteria.changedBackgroundEvent) {
    // bonus pass
    console.log("Great job! You've finished the level, including the extra challenge!");
    levelFailure(0, "genericBonusSuccess");
  } else if (validationProps.successCriteria.changedBackground) {
    // pass
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
