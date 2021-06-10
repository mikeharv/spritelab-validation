if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: false,
    noBehaviorsAt5Seconds: false,
    hasAtTimeEvent: false,
    oneSpriteStopped: false,
    allSpritesStopped: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper function
function checkEventLog(eventLog, eventType) {
  for (var i = 0; i < eventLog.length; i++) {
    if (eventLog[i].includes(eventType)) {
      return true;
    }
  }
  return false;
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for sprites
if (spriteIds.length >= 3) {
  validationProps.successCriteria.starterSprites = true;
}

if (World.seconds == 5) {
  if (checkEventLog(eventLog, "atTime: 5")) {
    validationProps.successCriteria.hasAtTimeEvent = true;
  }
  // Find the sprites that *don't* have behaviors, and see if they used to
  var numStopped = 0;
  var hadBehaviors = 0;
  for (var i = 0; i < spriteIds.length; i++) {
    var numBehaviors = getNumBehaviorsForSpriteId(spriteIds[i]);
    if (validationProps.previous[spriteIds[i]] != 0) {
      // Count all the sprites that used to have behaviors
      hadBehaviors++;
    }
    if (numBehaviors == 0) {
      if (validationProps.previous[spriteIds[i]] != 0) {
        // this is a sprite that stopped at time 5
        numStopped++;
      }
    }
  }

  if (numStopped == hadBehaviors && (hadBehaviors != 0)) {
    // All moving sprites were stopped (success)
    validationProps.successCriteria.allSpritesStopped = true;
  } else if (numStopped >= 1) {
    // Some, but not all stopped
    validationProps.successCriteria.oneSpriteStopped = true;
  } else if (hadBehaviors == 0) {
    // No sprites were ever moving
    validationProps.successCriteria.noBehaviorsAt5Seconds = true;
  }
}
for (var i = 0; i < spriteIds.length; i++) {
  validationProps.previous[spriteIds[i]] = getNumBehaviorsForSpriteId(spriteIds[i]);
}

if (validationProps.successCriteria.allSpritesStopped &&
  !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}


// Delay fail time (so student can observe the wrong animation)
var failTime = 210;
var earlyFailTime = 10;

if (World.frameCount > earlyFailTime && !validationProps.successCriteria.starterSprites) {
  levelFailure(3, "createAtLeastThreeSprites");
}

if (World.frameCount > failTime) {
  if (validationProps.successCriteria.noBehaviorsAt5Seconds) {
    console.log("Make sure your sprites start their behaviors before 5 seconds. Do you need to click on your sprites to make them start?");
    levelFailure(3, "startSpriteBehaviors");
  } else if (!validationProps.successCriteria.hasAtTimeEvent) {
    console.log("Add this block to your workspace. `at Time`");
    levelFailure(3, "addAtTimeEvent");
  } else if (!validationProps.successCriteria.oneSpriteStopped) {
    // No sprites stopped
    console.log("None of your sprites have stopped moving. Connect a `stops everything` block under the new event.");
    levelFailure(3, "noSpriteStoppedMoving");
  } else if (!validationProps.successCriteria.allSpritesStopped) {
    console.log("At least one of your sprites was still moving. Make sure you have a `stops everything` block for each sprite.");
    levelFailure(3, "atLeastOneSpriteStillMoving");
  }
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.allSpritesStopped) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
