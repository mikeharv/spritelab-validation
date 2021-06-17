var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.previous) {
  validationProps.previous = {}; // id => {background: 1}
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madePrompt: false,
    answeredPrompt: false,
    changedBackground: false,
    matchedBackground: false
  };
}

var allPrompts = getPromptVars();
var promptVars = Object.keys(allPrompts);
var failTime = 30;


if(!validationProps.previous.changedBackground&&validationProps.previous.background&& (getBackground()!=validationProps.previous.background)){
  validationProps.successCriteria.changedBackground = true;
  validationProps.failTime=World.frameCount+60;
  //console.log("once");
}


//check if they made any prompts
if(!validationProps.successCriteria.madePrompt){
  validationProps.successCriteria.madePrompt = promptVars.length>=1;
} else{
  //bump up the fail time if they did
  failTime = 300;
  if(validationProps.failTime<failTime){
    failTime=validationProps.failTime;
  }
  //check for a non-null value in any prompt variable
  for (var prop in promptVars) {
    if(allPrompts[promptVars[prop]]!= null){
      //console.log(allPrompts[promptVars[prop]]);
      validationProps.successCriteria.answeredPrompt = true;
    }
  }
  for (var prop in promptVars) {
    var enteredText=allPrompts[promptVars[prop]];
    if(enteredText==getBackground()){
      validationProps.successCriteria.matchedBackground = true;
    }
  }
}



/*
if(printLog.length){
  validationProps.successCriteria.printedText=true;

  if(printLog.length>validationProps.previous.logLength){
    validationProps.successCriteria.logIncreased=true;
  }
}
*/


//go through all the printed text and all prompts to see if they ever printed the text entered
//for (var i = 0; i < printLog.length; i++) {
  
//}

validationProps.previous = {
  background: getBackground()
};
//Set the successTime the first time they've passed the two main criteria
if(validationProps.successCriteria.matchedBackground&&!validationProps.successTime){
  //console.log(World.frameCount);
  validationProps.successTime=World.frameCount;
}
//console.log(failTime);

if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.madePrompt) {
    console.log('didntmakeprompt');
    levelFailure(3, 'addPrompt');
  } else if (!validationProps.successCriteria.answeredPrompt) {
    console.log('did not answer prompt');
    levelFailure(3, 'answerPrompt');
  } else if (!validationProps.successCriteria.changedBackground) {
    console.log('did not change bg');
    levelFailure(3, 'useColorVariable');
  } else if (!validationProps.successCriteria.matchedBackground) {
    console.log('changed bg but not the right way');
    levelFailure(3, 'useColorVariable');
  } 
}

var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Generic success');
  levelFailure(0, 'genericExplore');
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
