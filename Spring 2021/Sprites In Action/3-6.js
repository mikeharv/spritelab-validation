if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    behaviorsNotIncreased: true,
    rotatedBothDirections: false,
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check for sprites
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

// Check for increase in behaviors
var currentBehaviors = 0;
for (var i = 0; i < animations.length; i++) {
  // tally up all behaviors on any animation
  currentBehaviors += getNumBehaviorsForAnimation(animations[i]);
}
if (validationProps.behaviors < currentBehaviors) {
  validationProps.successCriteria.behaviorsNotIncreased = false;
}
validationProps.behaviors = currentBehaviors;

// Check for rotation changes
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentRotation = getProp({ id: spriteId }, "rotation");

  if (previous && previous.rotation > currentRotation) {
    previous.increasedRotation = true;
  } else if (previous && previous.rotation < currentRotation) {
    previous.decreasedRotation = true;
  }

  // Success criteria
  if (previous && previous.increasedRotation && previous.decreasedRotation) {
    validationProps.successCriteria.rotatedBothDirections = true;
  }

  // Create previous key if not defined. Else, update the rotation value
  if (!previous) {
    validationProps.previous[spriteId] = {
      rotation: currentRotation,
      increasedRotation: false,
      decreasedRotation: false,
    };
  } else {
    previous.rotation = currentRotation;
  }
}

if (
  validationProps.successCriteria.rotatedBothDirections &&
  !validationProps.successTime
) {
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 10;

if (
  !validationProps.failTime &&
  !validationProps.successCriteria.behaviorsNotIncreased
) {
  validationProps.failTime = World.frameCount + 100;
}
if (validationProps.failTime) {
  failTime = validationProps.failTime;
}

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    console.log(
      "It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below."
    );
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.behaviorsNotIncreased) {
    console.log("Increased behaviors. Use stop block.");
    levelFailure(3, "behaviorsIncreased");
  } else {
    failTime = 150;
  }
}
if (
  !validationProps.successCriteria.rotatedBothDirections &&
  World.frameCount > 150
) {
  console.log("Your sprite needs to spin both ways.");
  levelFailure(3, "spinBothWays");
}

// Pass 100 frames after success
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

// special timer for this level
push();
stroke("white");
if (
  !validationProps.successCriteria.starterSprite ||
  !validationProps.successCriteria.behaviorsNotIncreased
) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else if (!validationProps.successCriteria.rotatedBothDirections) {
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
