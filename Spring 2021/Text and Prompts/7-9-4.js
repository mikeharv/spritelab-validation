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
    madePrompts: false,
    answeredPrompt: false,
    printedText: false,
    logIncreased: false,
    madeTitle: false,
    titleContainsInput: false,
    subtitleContainsInput: false,
    usedJoinBlocks: false,
    hasSpaces:false
  };
}

var allPrompts = getPromptVars();
var promptVars = Object.keys(allPrompts);
var printLog = getPrintLog();
var failTime = 30;

//check if they made any prompts
if(!validationProps.successCriteria.madePrompts){
  validationProps.successCriteria.madePrompts = promptVars.length>=2;
} else{
  //bump up the fail time if they did
  failTime = 300;
  //check for a non-null value in any prompt variable
  for (var prop in promptVars) {
    if(allPrompts[promptVars[prop]]!= null && allPrompts[promptVars[prop]]!=""){
      console.log(allPrompts[promptVars[prop]]);
      validationProps.successCriteria.answeredPrompt = true;
    }
  }
}

//any printed text?
if(printLog.length){
  validationProps.successCriteria.printedText=true;
  //more than last frame?
  if(printLog.length>validationProps.previous.logLength){
    validationProps.successCriteria.logIncreased=true;
  }
}
validationProps.previous = {
  logLength: printLog.length
};

//check for a title screen
if(!validationProps.successCriteria.madeTitle){
  validationProps.successCriteria.madeTitle = (getTitle().title!='') || (getTitle().subtitle!='');
}


//go through the title screen text and all prompts to see if they ever printed the text entered
if (validationProps.successCriteria.answeredPrompt&&(getTitle().subtitle || getTitle().title)) {
  for (var prop in promptVars) {
    var enteredText=allPrompts[promptVars[prop]];
    var printedText1=getTitle().title;
    var printedText2=getTitle().subtitle;
    if(printedText1.includes(enteredText)){
      validationProps.successCriteria.titleContainsInput = true;
      //console.log(1);
    }
    if(printedText2.includes(enteredText)){
      validationProps.successCriteria.subtitleContainsInput = true;
      //console.log(2);
    }
  }
} 

//Set the successTime the first time they've passed the two main criteria
if(validationProps.successCriteria.subtitleContainsInput&&validationProps.successCriteria.titleContainsInput&&!validationProps.successTime){
  //console.log(World.frameCount);
  validationProps.successTime=World.frameCount;
}


if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.madePrompts) {
    console.log('didntmakeprompt');
    levelFailure(3, 'addPrompt');
  } else if (!validationProps.successCriteria.answeredPrompt) {
    console.log('did not answer prompt');
    levelFailure(3, 'answerPrompt');
  /*} else if (!validationProps.successCriteria.printedText) {
    console.log('did not print');
    levelFailure(3, 'addPrintBlock');
  } else if (!validationProps.successCriteria.logIncreased) {
    console.log('didnt use event');
    levelFailure(3, 'printWhenAnswered');*/
  } else if (!validationProps.successCriteria.madeTitle) {
    console.log('no title screen');
    levelFailure(3, 'noTitleScreen');
  } else if (!validationProps.successCriteria.titleContainsInput) {
    console.log('title did not print user text');
    levelFailure(3, 'titleVariable');
  } else if (!validationProps.successCriteria.subtitleContainsInput) {
    console.log('subtitle did not print user text');
    levelFailure(3, 'subtitleVariable');
  } else if (!validationProps.successCriteria.usedJoinBlocks) {
    console.log('did not concat');
    levelFailure(3, 'addJoinBlocks');
  /*} else if (!validationProps.successCriteria.hasSpaces) {
    console.log('add spaces');
    levelFailure(3, 'addSpaces');*/
  }
}

var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Prompt success');
  levelFailure(0, 'promptExplore');
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
