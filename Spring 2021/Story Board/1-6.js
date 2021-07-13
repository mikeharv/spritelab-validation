//Gabrielle: Students may have written additional code, including events and say blocks. Delay passing for 3 seconds, and further delay it if the app is active.

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    activeSpeech: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Check for at least 1 sprite
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

/*
for (var i = 0; i < spriteIds.length; i++) {
  if(getProp({ id: i }, "timeOut")){  
    validationProps.activeSpeech = true;
  }
}
*/

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

var failTime = 10;

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    // already existing feedback string
    console.log("You need to make a sprite.");
  	levelFailure(3, "noSprites");
  }
}

// Pass 5 seconds after success
var waitTime = 120;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
