// https://levelbuilder-studio.code.org/s/sb-pt-exp/lessons/1/levels/6
/*
Now it's time to introduce yourself!
Do This:
Use an event and the say block to make your sprite say something when it is clicked.
Run your code and click your sprite.
Be sure to only use information that is okay to share, such as your first name.
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
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

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  // check eventLog for WhenClick event
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

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
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
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.clickedSprite) {
    levelFailure(3, "singleSpriteNotClicked");
  } else if (!validationProps.successCriteria.spriteClickCausesSpeech) {
    levelFailure(3, "clickButNoSay");
  }
}

// Pass 120 frames after success
var waitTime = 150;
if (World.frameCount - validationProps.successTime >= waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite ||
    !validationProps.successCriteria.clickedSprite ||
    !validationProps.successCriteria.spriteClickCausesSpeech) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,(World.frameCount*400/waitTime),10);
}
pop();