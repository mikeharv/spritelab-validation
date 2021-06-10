if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    pressedKey: false,
    changedOnce: false,
    changedTwice: false,
    bonusUp: false,
    bonusDown: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var keyPressedNow = keyDown("up") || keyDown("down") || keyDown("left")|| keyDown("right") || 
  keyWentDown("up") || keyWentDown("down") || keyWentDown("left") || keyWentDown("right");
var keyPressedUp = keyDown("up") || keyWentDown("up");
var keyPressedDown = keyDown("down") || keyWentDown("down");

var failTime = 300;

// Check for sprites
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

// Check for ever pressing key
if (!validationProps.pressedKey) {
  validationProps.pressedKey = keyPressedNow;
}
validationProps.successCriteria.pressedKey = validationProps.pressedKey;

// check for scale change for each sprite
for (var i = 0; i < spriteIds.length; i++) {
  var spriteId = spriteIds[i];
  var previous = validationProps.previous[spriteId];
  var currentScale = getProp({ id: spriteId }, "scale");

  if (previous != undefined && previous != currentScale) {
    if(keyPressedNow) {
      if (validationProps.successCriteria.changedOnce && !validationProps.successTime) {
        validationProps.successCriteria.changedTwice = true;
        validationProps.successTime = World.frameCount;
      } else {
        validationProps.successCriteria.changedOnce = true;
      }
      // bonus criterion
      if (keyPressedUp && currentScale > previous) {
        validationProps.successCriteria.bonusUp = true;
      } else if (keyPressedDown && currentScale < previous) {
        validationProps.successCriteria.bonusDown = true;
      }
    }
  }
  validationProps.previous[spriteId] = currentScale;
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.starterSprite) {
  console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
  levelFailure(3, "starterSprites");
} 

//Fail at 10 seconds if we haven't succeeded
if (!validationProps.successCriteria.changedOnce && World.frameCount > failTime) {
  if(validationProps.successCriteria.pressedKey){
    console.log("Your size never changed. ");
    levelFailure(3, "noPropChangeKeyPressed");
  } else {
    console.log("Your didn't press a key. ");
    levelFailure(3,"didntPressKey");
  }
} else if (!validationProps.successCriteria.changedTwice && World.frameCount > failTime) {
  console.log("Your properties only changed once. ");
  levelFailure(3, "eventsOneChange");
}

//Pass 100 frames after success
var waitTime = 100;
if (World.frameCount-validationProps.successTime >= waitTime) {
  if (validationProps.successCriteria.bonusUp && validationProps.successCriteria.bonusDown) {
    console.log("Bonus success");
    levelFailure(0, "genericBonusSuccess");
  } else {
    console.log("Explore success");
    levelFailure(0, "genericExplore");
  }
}

//special timer for this level
push();
stroke("white");
if(!validationProps.successTime){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();