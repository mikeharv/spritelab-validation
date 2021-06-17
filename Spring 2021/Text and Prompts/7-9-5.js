if (!validationProps.previous) {
  validationProps.previous = {}; // id => {hadTitle: true}
}

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeTitle: false,
    hidTitle: false
  };
}

var titleScreen = getTitle();
//Pass if they have printed text
if(!validationProps.successCriteria.madeTitle){
  validationProps.successCriteria.madeTitle = (titleScreen.title!='') || (titleScreen.subtitle!='');
}

if(validationProps.successCriteria.madeTitle){
  //Pass if the current log is longer than the previous frame
  validationProps.successCriteria.hidTitle = !titleScreen.title && !titleScreen.subtitle;
}

if(!validationProps.successTime){
  if(validationProps.successCriteria.hidTitle){
    validationProps.successTime=World.frameCount;
  }
}

var failTime = 150;
if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.madeTitle) {
    console.log('didnt print title');
    levelFailure(3, 'addTitleScreen');
  } else if (!validationProps.successCriteria.hidTitle) {
    console.log('did not hide title');
    levelFailure(3, 'hideTitleScreen');
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
