var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    usedSpeech: false
  };
}

var spriteIds = getSpriteIdsInUse();

for (var i = 0; i < spriteIds.length; i++) {
  if(getProp({ id: i }, "speech")){  
    validationProps.successCriteria.usedSpeech = true;
  }
  if(getProp({ id: i }, "timeOut")){  
    validationProps.activeSpeech = true;
  }
}


// Check if this is the first frame that meets the success criteria
if (!validationProps.successTime&&validationProps.successCriteria.usedSpeech) {
  validationProps.successTime = World.frameCount;
  //console.log(validationProps.successTime);
}

var failTime = 30;
if(World.frameCount > failTime){
  if(!validationProps.successCriteria.usedSpeech){
    console.log("Did not use speech");
    levelFailure(3, 'addPrintBlock');
  } else {
    console.log(validationProps);
  }
}
var waitTime = 130;
if ((World.frameCount - validationProps.successTime >= waitTime) && !validationProps.activeSpeech) {
  console.log('Generic success');
  levelFailure(0, 'genericSuccess');
}

push();
if(!validationProps.successTime){
  fill(rgb(118, 102, 160));
  rect(0, 390, (World.frameCount * 400) / failTime, 10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
