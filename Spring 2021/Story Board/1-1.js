if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Count Sprites
validationProps.successCriteria.starterSprite = (spriteIds.length>=1);

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "noSprites");
  } 
}

// Pass 60 frames after success
var waitTime = 60;
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
