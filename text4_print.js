var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    printedText: false
  };
}

var printLog = getPrintLog();

if(printLog.length>=1){  
  validationProps.successCriteria.printedText = true;
}


// Check if this is the first frame that meets the success criteria
if (!validationProps.successTime&&validationProps.successCriteria.printedText) {
  validationProps.successTime = World.frameCount;
  //console.log(validationProps.successTime);
}

var failTime = 10;
if(!validationProps.successCriteria.printedText){
  console.log("Did not Print text");
  levelFailure(3, 'addPrintBlock');
}
var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Generic success');
  levelFailure(0, 'genericSuccess');
}

push();
if(validationProps.successTime){
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
