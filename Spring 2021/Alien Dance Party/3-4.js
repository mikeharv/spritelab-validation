if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: false,
    clickedMouse: false,
    otherSpriteClicked: false,
    changedBehaviorByClick: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// includes function
function arrayEqual(array1, array2) {
  if (array1.length != array2.length) {
    return false;
  }

  for (var i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i]) {
      return false;
    }
  }
  return true;
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for sprites
if (spriteIds.length >= 2) {
  validationProps.successCriteria.starterSprites = true;
}

// Check eventLog for WhenClick event
var currentEvent = eventLog[eventLog.length - 1] || "";
if (currentEvent != "" && currentEvent.includes("whenClick: ")) {
  validationProps.successCriteria.clickedMouse = true;

  var spriteId = parseInt(currentEvent.split(" ")[1]);

  // We only want to check the new sprites
  if (spriteId != 0) {
    var previous = validationProps.previous[spriteId] || [];
    var currentBehaviorList = getBehaviorsForSpriteId(spriteId);

    if (!arrayEqual(previous, currentBehaviorList)) {
      validationProps.successCriteria.changedBehaviorByClick = true;
    }
  } else {
    // Old sprite was clicked on
    validationProps.successCriteria.otherSpriteClicked = true;
  }
}

if (validationProps.successCriteria.changedBehaviorByClick &&
    !validationProps.successTime) 
{
  validationProps.successTime = World.frameCount;
}

// Record behaviorList for each sprite
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  validationProps.previous[spriteId] = getBehaviorsForSpriteId(spriteId);
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 10;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprites) {
    levelFailure(3, "createAtLeastTwoSprites");
  } else {
    failTime = 200;
    if (!validationProps.successCriteria.clickedMouse && (World.frameCount > failTime)) {
      console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
      levelFailure(3, "spriteNotClicked");
    } else if (validationProps.successCriteria.otherSpriteClicked && !validationProps.successCriteria.changedBehaviorByClick && (World.frameCount > failTime)) {
      console.log("Make sure you click on your new sprite and that it also has a `when clicked` event in your workspace.");
      levelFailure(3, "clickNewSprite");
    } else if (validationProps.successCriteria.clickedMouse && !validationProps.successCriteria.changedBehaviorByClick && (World.frameCount > failTime)) {
      console.log("Your new sprite needs to start a behavior when it is clicked.");
      levelFailure(3, "startBehaviorWhenClicked");
    }
  }
}

// Pass 100 frames after success
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.changedBehaviorByClick) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();