if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    hasNoStartBehavior: true,
    clickedMouse: false,
    changedRotationByClick: false,
    changedRotationByOther: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// includes function
function includes(eventLog, spriteId) {
  for (var i = 0; i < eventLog.length; i++) {
  	if (eventLog[i] == ("whenClick: " + spriteId)) {
  		return true;
    }
  }
  return false;
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for sprites
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

var totalBehaviors = 0;

for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  totalBehaviors += getNumBehaviorsForSpriteId(spriteId);
}
if (World.frameCount == 1 && totalBehaviors >= 1) {
  validationProps.successCriteria.hasNoStartBehavior = false;
}

/*
  Adds sprite to previous after it's been clicked on
  If the sprite does not rotate on the next frame, we know the student did not put a spin behavior on the `when clicked` block.
  If the sprite rotates on the next frame, we can assume they put a spin behavior on the `when clicked` block.
  If the sprite rotates after the next frame, there rotation was caused by another event.

*/
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentRotation = getProp({ id: spriteId }, "rotation");

  if (!previous) {
    validationProps.previous[spriteId] = { "rotation": currentRotation, "clicked": false, "nextFrame": true }; 
  } else {
    if (previous.rotation != currentRotation) {
      if (previous.clicked && previous.nextFrame) {
        validationProps.successCriteria.changedRotationByClick = true;
      } else {
        validationProps.successCriteria.changedRotationByOther = true;
      }
      validationProps.previous[spriteId].nextFrame = false;
    }
    validationProps.previous[spriteId].rotation = currentRotation;
  }

  if (includes(eventLog, spriteId)) {
  	validationProps.successCriteria.clickedMouse = true;
    validationProps.previous[spriteId].clicked = true;
  }
}

if (validationProps.successCriteria.changedRotationByClick &&
    !validationProps.successTime) 
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 10;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.hasNoStartBehavior) {
    console.log("Your sprite began a behavior too soon. Move it underneath the event block.");
    levelFailure(3, "behaviorBeforeClick");
  }
  else {
    failTime = 200;
    if (!validationProps.successCriteria.clickedMouse && (World.frameCount > failTime)) {
      console.log("Make sure that you click on the sprite and that you have the right event in your workspace.");
      levelFailure(3, "spriteNotClickedWithBlockXML");
    } else if (!validationProps.successCriteria.changedRotationByOther && !validationProps.successCriteria.changedRotationByClick && (World.frameCount > failTime)) {
      console.log("Your sprite did not spin. Try a different behavior");
      levelFailure(3, "spriteDidntRotate");
    } else if (validationProps.successCriteria.changedRotationByOther && !validationProps.successCriteria.changedRotationByClick && (World.frameCount > failTime)) {
      console.log("Your sprite was spinning before you clicked on it. Make sure that your spin behavior is connected to this event.");
      levelFailure(3, "spinBeforeClick");
    }
  }
}

//Pass 100 frames after success
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.changedRotationByClick) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();