// https://levelbuilder-studio.code.org/s/sb-pt-exp/lessons/1/levels/2
/*
Use the say block to make this sprite say whatever you like!
You can find the say block under the Sprites tab.
*/
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    usedSpeech: false,
    activeSpeech: false
  };
}

//Helper variables
var spriteIds = getSpriteIdsInUse();

//Count Sprites
validationProps.successCriteria.starterSprite = spriteIds.length>=1;

//Check if a sprite has active speech
for (var spriteId in spriteIds) {
  if(getProp({ id: spriteId }, "speech")){  
    validationProps.successCriteria.usedSpeech = true;
    if(getProp({ id: spriteId }, "timeOut")>0){
      validationProps.successCriteria.activeSpeech = true;
    } else {
      validationProps.successCriteria.activeSpeech = false;
    }
  }
}

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.usedSpeech &&
    !validationProps.successTime) {
  validationProps.successTime = World.frameCount;
}

var failTime = 10;
// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "noSprites");
  } else if (!validationProps.successCriteria.usedSpeech) {
    levelFailure(3, "sayBlock");
  } 
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime) {
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite ||
    !validationProps.successCriteria.usedSpeech ||
    validationProps.successCriteria.activeSpeech) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();