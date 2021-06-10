if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    hasBehavior: false,
    increasedRotation: false,
    decreasedRotation: false,
    pressedKey: false,
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

// Check if a sprite has a starting behavior
var numBehaviors = 0;
for (var i = 0; i < animations.length; i++) {
  numBehaviors += getNumBehaviorsForAnimation(animations[i]);
}
validationProps.successCriteria.hasBehavior = (numBehaviors >= 1);

// Check for rotation changes
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentRotation = getProp({ id: spriteId }, "rotation");

  if (previous != undefined) {
    if (currentRotation > previous) {
      validationProps.successCriteria.increasedRotation = true;
    } else if (currentRotation < previous) {
      validationProps.successCriteria.decreasedRotation = true;
    }
  }
  validationProps.previous[spriteId] = currentRotation;
}

if (validationProps.successCriteria.increasedRotation && 
    validationProps.successCriteria.decreasedRotation &&
    !validationProps.successTime) 
{
  validationProps.successTime = World.frameCount;
}

// Check for ever pressing key
if(!validationProps.successCriteria.pressedKey){
  validationProps.successCriteria.pressedKey = keyWentDown("up") || keyWentDown("down") || keyWentDown("left") || keyWentDown("right");
}

//Delay fail time (so student can observe the wrong animation)
var failTime = 10;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.hasBehavior){
    console.log("Your sprite had no behaviors.");
    levelFailure(3, "noBehavior");
  } else {
    failTime = 350;
    // Fail at failTime frames if we haven't succeeded
    if ((!validationProps.successCriteria.decreasedRotation || !validationProps.successCriteria.increasedRotation) && 
          World.frameCount > failTime) 
    {
      if(!validationProps.successCriteria.pressedKey) {
        console.log("You didn't press a key");
        levelFailure(3, "didntPressKey");
      } else {
        console.log("Your sprite needs to spin both left and right.");
        levelFailure(3, "spinBothWays");
      }
    }
  }
}

//Pass 100 frames after success
var waitTime = 200;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

//special timer for this level
push();
stroke("white");
if(!validationProps.successCriteria.decreasedRotation || !validationProps.successCriteria.increasedRotation) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();