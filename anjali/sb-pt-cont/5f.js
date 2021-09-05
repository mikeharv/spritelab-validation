// https://levelbuilder-studio.code.org/s/sb-pt-cont/lessons/1/levels/5/sublevel/6
/*
Use the blocks in the new behaviors category to animate one of the sprites.
Behaviors are actions that happen over and over while the program runs. To give a sprite a behavior, you need to use a sprite begins block with a behavior block.
Challenge: Use events to make a sprite begin a behavior when it is clicked.
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	starterSprite: false,
    changedBehavior: false,
    changedBehaviorEvent: false
  };
}

// Keep track of sprites' current behaviors
if (!validationProps.previous) {
  validationProps.previous = {
    numSpritesBehaviors: {}
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}

if (World.frameCount == 1) {
  for (var i = 0; i < spriteIds.length; i++) {
    var numSpriteBehaviors = getNumBehaviorsForSpriteId(spriteIds[i]);
    if (numSpriteBehaviors >= 1) {
      validationProps.successCriteria.changedBehavior = true;
    }
  	validationProps.previous.numSpritesBehaviors[spriteIds[i]] = numSpriteBehaviors;
  }
} else {
  // Check if new event happened
  if ((eventLog.length > validationProps.previous.eventLogLength) &&
      !validationProps.successCriteria.changedBehaviorsEvent) {
    var currentEvent = eventLog[eventLog.length - 1];
    // check eventLog for WhenClick or WhileClick event
    if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
      for (var i = 0; i < spriteIds.length; i++) {
        var numSpriteBehaviors = getNumBehaviorsForSpriteId(spriteIds[i]);
        // check if sprite has changed behaviors since previous frame
        if (numSpriteBehaviors > validationProps.previous.numSpritesBehaviors[spriteIds[i]]) {
          validationProps.successCriteria.changedBehaviorEvent = true;
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
    validationProps.successCriteria.changedBehavior) ||
    (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.changedBehaviorEvent) &&
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
  	levelFailure(3, "noBehavior");
  } else if (validationProps.successCriteria.changedBehaviorEvent) {
    // bonus pass
    levelFailure(0, "genericBonusSuccess");
  } else if (validationProps.successCriteria.changedBehavior) {
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