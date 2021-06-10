if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    increasedScale: false,
    decreasedScale: false,
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

// Check for scale changes
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentScale = getProp({ id: spriteId }, "scale");

  if (previous != undefined) {
    if (currentScale > previous) {
      validationProps.successCriteria.increasedScale = true;
    } else if (currentScale < previous) {
      validationProps.successCriteria.decreasedScale = true;
    }
  }
  validationProps.previous[spriteId] = currentScale;
}

if (validationProps.successCriteria.increasedScale && 
    validationProps.successCriteria.decreasedScale &&
    !validationProps.successTime) 
{
  validationProps.successTime = World.frameCount;
}

// Check for ever pressing key
if(!validationProps.successCriteria.pressedKey){
  validationProps.successCriteria.pressedKey= keyWentDown("up") || keyWentDown("down") || keyWentDown("left") || keyWentDown("right");
}

//Delay fail time (so student can observe the wrong animation)
var failTime = 10;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else {
    failTime = 350;
    // Fail at failTime frames if we haven't succeeded
    if ((!validationProps.successCriteria.decreasedScale || !validationProps.successCriteria.increasedScale) && 
          World.frameCount > failTime) 
    {
      if(!validationProps.successCriteria.pressedKey){
        console.log("You didn't press a key");
        levelFailure(3, "didntPressKey");
      } else {
        console.log("Your sprite needs to shrink and grow.");
        levelFailure(3, "growAndShrink");
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
if(!validationProps.successCriteria.decreasedScale || !validationProps.successCriteria.increasedScale){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();