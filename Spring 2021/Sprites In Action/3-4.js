if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    behaviorsIncreased: false,
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
for (var i = 0; i < animations.length; i++) {
  var animation = animations[i];
  var previous = validationProps.previous[animation];
  var currentNumBehaviors = getNumBehaviorsForAnimation(animation);
  if (previous != undefined && previous < currentNumBehaviors) {
    validationProps.successCriteria.behaviorsIncreased = true;
  }
  validationProps.previous[animation] = currentNumBehaviors;
}

if (
  !validationProps.successTime &&
  validationProps.successCriteria.behaviorsIncreased
) {
  validationProps.successTime = World.frameCount;
}

if (World.frameCount > 10) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "starterSprites");
  }
}

// Fail at 10 seconds if we haven't succeeded
if (!validationProps.successCriteria.behaviorsIncreased && World.seconds > 10) {
  levelFailure(3, "noNewBehavior");
}

// Pass 100 frames after success
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  levelFailure(0, "genericExplore");
}

// Special timer for this level
push();
stroke("white");
if (!validationProps.successCriteria.starterSprite) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else if (!validationProps.successCriteria.behaviorsIncreased) {
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.seconds * 400) / 10 + 1, 10);
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
