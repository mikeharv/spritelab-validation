if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	starterSprite: false,
    changedCostumeEvent: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Keep track of sprites' current costumes
if(!validationProps.spritesCostumes) {
  validationProps.spritesCostumes = {};
  for (var spriteId in  spriteIds) {
    validationProps.spritesCostumes[spriteId] = getProp({id: spriteId}, "costume");
  }
}

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}

// Check if new event happened
if ((eventLog.length > validationProps.previous.eventLogLength) && !validationProps.successCriteria.changedCostumeEvent) {
  var currentEvent = eventLog[eventLog.length - 1];
  // check eventLog for WhenClick or WhileClick event
  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    for (var spriteId in spriteIds) {
      var spriteCostume = getProp({id: spriteId}, "costume");
      if (validationProps.spritesCostumes[spriteId] == undefined) {
        validationProps.spritesCostumes[spriteId] = spriteCostume;
      }
      // check if sprite has changed costume since previous frame
      if (spriteCostume != validationProps.spritesCostumes[spriteId]) {
        validationProps.successCriteria.changedCostumeEvent = true;
        break;
      }
    }
  }
}

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.changedCostumeEvent &&
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
    console.log("None of your sprites changed costumes.");
  	levelFailure(3, "changeOrSetCostume");
  } else if (validationProps.successCriteria.changedCostumeEvent) {
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
