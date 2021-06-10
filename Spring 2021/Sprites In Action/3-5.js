if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    pressedKey: false,
    changedOnce: false,
    changedTwice: false,
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime = 300;

var keyPressedNow =
  keyWentDown("up") ||
  keyWentDown("down") ||
  keyWentDown("left") ||
  keyWentDown("right");

// Check for sprites
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

// Check for ever pressing key
if (!validationProps.pressedKey) {
  validationProps.pressedKey = keyPressedNow;
}
validationProps.successCriteria.pressedKey = validationProps.pressedKey;

// Check for key press changes
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentX = getProp({ id: spriteId }, "x");
  var currentY = getProp({ id: spriteId }, "y");
  var currentScale = getProp({ id: spriteId }, "scale");
  var currentRotation = getProp({ id: spriteId }, "rotation");
  if (previous) {
    if (
      previous.x != currentX ||
      previous.y != currentY ||
      previous.scale != currentScale ||
      previous.rotation != currentRotation
    ) {
      if (validationProps.successCriteria.changedOnce && !validationProps.successTime) {
        console.log("second");
        validationProps.successCriteria.changedTwice = true;
        validationProps.successTime = World.frameCount;
      } else {
        console.log("first");
        validationProps.successCriteria.changedOnce = true;
      }
    }
  }
  validationProps.previous[spriteId] = {
    x: currentX,
    y: currentY,
    scale: currentScale,
    rotation: currentRotation,
  };
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.starterSprite) {
  console.log(
    "It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below."
  );
  levelFailure(3, "starterSprites");
}

// Fail at 10 seconds if we haven't succeeded
if (
  !validationProps.successCriteria.changedOnce &&
  World.frameCount > failTime
) {
  if (validationProps.successCriteria.pressedKey) {
    console.log("Your properties never changed. ");
    levelFailure(3, "noPropChangeKeyPressed");
  } else {
    console.log("Your didn't press a key. ");
    levelFailure(3, "didntPressKey");
  }
} else if (
  !validationProps.successCriteria.changedTwice &&
  World.frameCount > failTime
) {
  console.log("Your properties only changed once. ");
  levelFailure(3, "eventsOneChange");
}

//Pass 100 frames after success
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Explore success");
  levelFailure(0, "genericExplore");
}

//special timer for this level
push();
stroke("white");
if (!validationProps.successTime) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else {
  fill(rgb(0, 173, 188));
  rect(
    0,
    390,
    ((World.frameCount - validationProps.successTime) * 400) / waitTime,
    10
  );
}
pop();
