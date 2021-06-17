var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.previous) {
  validationProps.previous = {}; // id => {logLength: 1, background: "white"}
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madePrompt: false,
    answeredPrompt: false,
    enteredBlank: false,
    printedText: false,
    logIncreased: false,
    madeTitle: false,
    titleContainsInput: false,
    subtitleContainsInput: false,
    containsInput: false,
    usedJoinBlocks: false,
    changedBackground: false,
    matchedBackground: false
  };
}

var allPrompts = getPromptVars();
var promptVars = Object.keys(allPrompts);
var printLog = getPrintLog();
if(!validationProps.failTime){
  validationProps.failTime = 30;
}

if(!validationProps.previous.changedBackground&&validationProps.previous.background&& (getBackground()!=validationProps.previous.background)){
  validationProps.successCriteria.changedBackground = true;
  validationProps.failTime=World.frameCount+60;
  //console.log("once");
}


//check if they made any prompts
if(!validationProps.successCriteria.madePrompt){
  validationProps.successCriteria.madePrompt = promptVars.length>=1;
} else{
  //check for a non-null value in any prompt variable
  if(!validationProps.successCriteria.answeredPrompt&&!validationProps.successCriteria.enteredBlank){
    validationProps.failTime = 300;
    for (var prop in promptVars) {
      if(allPrompts[promptVars[prop]]!= null){
        if(allPrompts[promptVars[prop]]!= ""){
          //console.log(allPrompts[promptVars[prop]]);
          validationProps.successCriteria.answeredPrompt = true;
          validationProps.failTime = World.frameCount+60;
          if(!validationProps.previous.changedBackground&&getBackground()!=validationProps.previous.background){
            //add ^ validationProps.previous.background&&
            validationProps.successCriteria.changedBackground = true;
            //validationProps.failTime=World.frameCount+60;
            //console.log("once");
            var enteredText=allPrompts[promptVars[prop]];
            if(enteredText&&getBackground()&&enteredText==getBackground()){
              validationProps.successCriteria.matchedBackground = true;
              //console.log("bg: " + getBackground() + " | entered: " + enteredText);
            }
          }
        }
        else if (!validationProps.successCriteria.enteredBlank){
          validationProps.successCriteria.enteredBlank=true;
          validationProps.failTime=World.frameCount+60;
        }
      }
    }
  }
  /*for (var prop in promptVars) {
    var enteredText=allPrompts[promptVars[prop]];
    if(enteredText&&getBackground()&&enteredText==getBackground()){
      validationProps.successCriteria.matchedBackground = true;
      //console.log("bg: " + getBackground() + " | entered: " + enteredText);
    }
    failTime = World.seconds+50;
  }*/
}
//console.log(validationProps.failTime + '/' + World.frameCount);
//any printed text?
if(printLog.length){
  validationProps.successCriteria.printedText=true;
  //console.log("printed");
  //more than last frame?
  if(printLog.length>validationProps.previous.logLength){
    validationProps.successCriteria.logIncreased=true;
  }
}
validationProps.previous = {
  logLength: printLog.length,
  background: getBackground()
};



//go through all the printed text and all prompts to see if they ever printed the text entered
for (var i = 0; i < printLog.length; i++) {
  for (var prop in promptVars) {
    var enteredText=allPrompts[promptVars[prop]];
    if(enteredText){
      enteredText=enteredText.toString();
    }
    var printedText=printLog[i].toString();
    if(printedText.includes(enteredText)){
      validationProps.successCriteria.containsInput = true;
      if(printedText!=enteredText){
        validationProps.successCriteria.usedJoinBlocks = true;
      }
    }
  }
} 


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
      validationProps.successCriteria.containsInput = true;
      if(printedText!=enteredText){
        validationProps.successCriteria.usedJoinBlocks = true;
      }
      //console.log(1);
    }
    if(printedText2.includes(enteredText)){
      validationProps.successCriteria.containsInput = true;
      if(printedText!=enteredText){
        validationProps.successCriteria.usedJoinBlocks = true;
      }
      //console.log(2);
    }
  }
} 

//Set the successTime the first time they've passed the two main criteria
if((validationProps.successCriteria.containsInput||validationProps.successCriteria.matchedBackground)&&validationProps.successCriteria.answeredPrompt&&!validationProps.successTime){
  //console.log(World.frameCount);
  validationProps.successTime=World.frameCount;
    //console.log(validationProps.successCriteria.containsInput+" | " + validationProps.successCriteria.matchedBackground + " |" + validationProps.successTime);
}

var failTime=validationProps.failTime;

if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.madePrompt) {
    console.log('didntmakeprompt' + World.frameCount);
    levelFailure(3, 'addPrompt');
  } else if (!validationProps.successCriteria.answeredPrompt) {
    console.log('did not answer prompt' + World.frameCount);
    levelFailure(3, 'answerPrompt');
  } else if (validationProps.successCriteria.madeTitle) {
    if(validationProps.successCriteria.printedText) {
      if(validationProps.successCriteria.logIncreased) {
        console.log('did not print user text' + World.frameCount);
        levelFailure(3, 'printVariable');
      } else {
        console.log('use var in one place or another' + World.frameCount);
        levelFailure(3, 'noVarUse');
      }
    } else {
      console.log('title but no var' + World.frameCount);
      levelFailure(3, 'titleVariable');
    } 
  } else if(validationProps.successCriteria.printedText) {
    //console.log("printed");
    if(validationProps.successCriteria.logIncreased) {
      console.log('did not print user text' + World.frameCount);
      levelFailure(3, 'printVariable');
    } else {
      console.log('did not print with event' + World.frameCount);
      levelFailure(3, 'printWhenAnswered');
    }
  } else {
    console.log('add some text with print or title screen' + World.frameCount);
    levelFailure(3, 'addText');
  }
}



var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Prompt success' + World.frameCount);
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
