if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    tooManySprites: false,
    waitedEightSeconds: true,
    movedAcrossScreen: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {
    x: undefined,
    y: undefined
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime = 10;

// Check for sprites
if(spriteIds.length == 1){
  validationProps.successCriteria.starterSprites = true;
  validationProps.successCriteria.tooManySprites = false;
} else if (spriteIds.length > 1){
  validationProps.successCriteria.starterSprites = true;
  validationProps.successCriteria.tooManySprites = true;
} else {
  validationProps.successCriteria.starterSprites = false;
  validationProps.successCriteria.tooManySprites = false;
}

// Get sprite x and y locations
if (spriteIds.length >= 1) {
  var currentX = getProp({id: spriteIds[0]}, "x");
  var currentY = getProp({id: spriteIds[0]}, "y");

  // Q: is there a better way to initialize the initial values?
  if (validationProps.previous.x == undefined) {
    validationProps.previous.x = currentX;
    validationProps.previous.y = currentY;
  }

  // Check for sprite moving too early
  if(validationProps.previous.x != currentX || validationProps.previous.y != currentY) {
    if(World.seconds < 8) {
      validationProps.successCriteria.waitedEightSeconds = false;
    } else if (getNumBehaviorsForAnimation(animations[0]) >= 1) {
      validationProps.successCriteria.movedAcrossScreen = true;
      if(!validationProps.successTime){
        validationProps.successTime = World.frameCount;
      }
    }
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (validationProps.successCriteria.tooManySprites) {
    console.log("too many sprites");
    levelFailure(3, "tooManySprites");
  } else if (!validationProps.successCriteria.waitedEightSeconds) {
    console.log("the sprite moved too soon");
    levelFailure(3, "spriteMovedTooSoon");
  }
}

//Fail at 8 seconds if we haven't succeeded
if (!validationProps.successCriteria.movedAcrossScreen && World.seconds > 8) {
  stopSound();
  console.log("ship did not move");
  levelFailure(3, "shipStayedInBounds");
}


//Pass after 10 seconds
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Standard success");
  levelFailure(0, "genericSuccess");
} 

push();
stroke("white");
if(!validationProps.successCriteria.starterSprites || 
   validationProps.successCriteria.tooManySprites || 
   !validationProps.successCriteria.waitedEightSeconds) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else if (!validationProps.successCriteria.movedAcrossScreen) {
  fill(rgb(118,102,160));
  rect(0,390,(World.seconds*400/8),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();