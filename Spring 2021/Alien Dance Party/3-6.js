if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: false,
    pressedKey: false,
    keyPressEvent: false,
    changedTintByKeyPress: false,
    changedTintByOther: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper function
function getKeyWentDown() {
  return keyWentDown('up') || keyWentDown('down') || keyWentDown('left') || keyWentDown('right');
}

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
var keyPress = getKeyWentDown();

// Check for sprites
if (spriteIds.length >= 3) {
  validationProps.successCriteria.starterSprites = true;
}

// Check if key was pressed
if (!validationProps.successCriteria.pressedKey && keyPress) {
  validationProps.successCriteria.pressedKey = true;
}

// Check if whenPress event exists in event log
if (!validationProps.successCriteria.keyPressEvent && checkEventLog(eventLog, "whenPress: ")) {
  validationProps.successCriteria.keyPressEvent = true;
}

// Check if sprite tint changed
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentTint = getProp({ id: spriteId}, "tint");

  if (previous && (previous != currentTint)) {
    if (keyPress) {
      validationProps.successCriteria.changedTintByKeyPress = true;
    } else {
      validationProps.successCriteria.changedTintByOther = true;
    }
  }
  validationProps.previous[spriteId] = currentTint;
}

if (validationProps.successCriteria.changedTintByKeyPress &&
  !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 10;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else {
    failTime = 200;
    if (validationProps.successCriteria.changedTintByOther && !validationProps.successCriteria.changedTintByKeyPress && (World.frameCount > failTime)) {
      console.log("Your sprite changed color at the wrong time. Move the `change color` block under a `when key pressed` block.");
      levelFailure(3, "colorChangedBeforeKeyPress");
    } else if (!validationProps.successCriteria.pressedKey && (World.frameCount > failTime)) {
      levelFailure(3, "didntPressKey");
    } else if (validationProps.successCriteria.pressedKey && !validationProps.successCriteria.keyPressEvent && (World.frameCount > failTime)) {
      console.log("Add this block to your workspace: <XML>when pressed</XML>");
      levelFailure(3, "keyPressButNoEvent");
    } else if (validationProps.successCriteria.keyPressEvent && !validationProps.successCriteria.changedTintByKeyPress && (World.frameCount > failTime))  {
      console.log("A sprite should change colors. Add this block to your new event: <XML>change color</XML>");
   	  levelFailure(3, "changeColorWhenKeyPressed");
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
if (!validationProps.successCriteria.changedTintByKeyPress) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
