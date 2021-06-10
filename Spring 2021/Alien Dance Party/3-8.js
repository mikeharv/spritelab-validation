if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: false,
    spritesTouched: false,
    hasTouchEvent: false,
    touchTriggeredBehavior: false,
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

// Check for event
if (checkEventLog(eventLog, "whenTouch")) {
  validationProps.successCriteria.hasTouchEvent = true;
  validationProps.successCriteria.spritesTouched = true;
}

// Do handshake if no sprites have touched yet
if (!validationProps.successCriteria.spritesTouched) {
  // See if sprites touched
  for (var i = 0; i < spriteIds.length; i++) {
    var outer = spriteIds[i];

    for (var j = 0; j < spriteIds.length; j++) {
      var inner = spriteIds[j];
      if (outer != inner && isTouchingSprite({ id: outer }, { id: inner })) {
        validationProps.successCriteria.spritesTouched = true;
      }
    }
  } 
}

// Checking for behavior change when sprites touch
var currentEvent = eventLog[eventLog.length - 1] || "";
if (currentEvent != "" && currentEvent.includes("whenTouch")) {
  for (var i = 0; i < spriteIds.length; i ++) {
    var spriteBehaviors = getBehaviorsForSpriteId(spriteIds[i]);
    var previousBehaviors = validationProps.previous[spriteIds[i]];

    // Sprite behavior changed (success)
    if (previousBehaviors && spriteBehaviors.toString() !== previousBehaviors.toString()) {
      validationProps.successCriteria.touchTriggeredBehavior = true;
    }
  }
}

// Storing sprite's behavior list
for (var i = 0; i < spriteIds.length; i++) {
  validationProps.previous[spriteIds[i]] = getBehaviorsForSpriteId(spriteIds[i]);
}

// Set success time if success
if (validationProps.successCriteria.touchTriggeredBehavior &&
  !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime && !validationProps.successCriteria.starterSprites) {
  levelFailure(3, "createAtLeastThreeSprites");
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.spritesTouched) {
    console.log("Make sure your sprites touch at some point.");
    levelFailure(3, "spritesNotTouch");
  } else if (!validationProps.successCriteria.hasTouchEvent) {
    console.log("Make sure whenTouches event is in your workspace.");
    levelFailure(3, "addWhenTouchesEvent");
  } else if (!validationProps.successCriteria.touchTriggeredBehavior) {
    console.log("A sprite needs to change behavior when two sprites touch.");
    levelFailure(3, "changeSpriteBehaviorsWhenTouch");
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
if (!validationProps.successCriteria.touchTriggeredBehavior) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();