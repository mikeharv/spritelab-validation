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
    madePrompt: false,
    answeredPrompt: false
  };
}

var allPrompts = getPromptVars();
var promptVars = Object.keys(allPrompts);
var printLog = getPrintLog();
var failTime = 30;

if(!validationProps.successCriteria.madePrompt){
  validationProps.successCriteria.madePrompt = promptVars.length>=1;
} else{
  failTime = 300;
  for (var prop in promptVars) {
    if(allPrompts[promptVars[prop]]!= null){
      console.log(allPrompts[promptVars[prop]]);
      validationProps.successCriteria.answeredPrompt = true;
    }
  }
}
if(validationProps.successCriteria.answeredPrompt&&!validationProps.successTime){
  console.log(World.frameCount);
  validationProps.successTime=World.frameCount;
}

/*if(printLog.length){

  if(printLog.length>validationProps.previous.logLength){
    validationProps.successCriteria.logIncreased=true;

    validationProps.successTime=World.frameCount;
  }

  validationProps.previous = {
    logLength: printLog.length
  };
}*/


if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.madePrompt) {
    console.log('didntmakeprompt');
    levelFailure(3, 'addPrompt');
  } else if (!validationProps.successCriteria.answeredPrompt) {
    console.log('did not answer prompt');
    levelFailure(3, 'answerPrompt');
  }
}

var waitTime = 1;
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
