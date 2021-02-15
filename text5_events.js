var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.previous) {
  validationProps.previous = {}; // id => {logLength: 1}
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    printedText: false,
    logIncreased: false
  };
}

var printLog = getPrintLog();
//Pass if they have printed text
if(!validationProps.successCriteria.printedText){
  validationProps.successCriteria.printedText = printLog.length>=1;
}

if(printLog.length){
  //Pass if the current log is longer than the previous frame
  if(printLog.length>validationProps.previous.logLength){
    validationProps.successCriteria.logIncreased=true;
    //Reset the success timer each time a new print block is used
    validationProps.successTime=World.frameCount;
  }
  //Store the current length as the new previous
  validationProps.previous = {
    logLength: printLog.length
  };
}

var failTime = 300;
if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.printedText) {
    console.log('didnt print text');
    levelFailure(3, 'debug1');
  } else if (!validationProps.successCriteria.logIncreased) {
    console.log('did not use events');
    levelFailure(3, 'debug2');
  }
}

var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Generic success');
  levelFailure(0, 'genericSuccess');
}

push();
if(!validationProps.successTime){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
