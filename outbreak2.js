//https://levelbuilder-studio.code.org/levels/24539/edit
//1. Number of sick sprites must increase from the first frame. 
var sickSpritesIncreased = false;

//Declare helper variables
var waitTime=250;
var failTime=250;

//Logic for criteria #1
if(validationProps.lastSickCount<countByAnimation({costume: "sick"})){
  sickSpritesIncreased = true;
} else {
  validationProps.lastSickCount = countByAnimation({costume: "sick"});
}

// Record success time
if(sickSpritesIncreased && !validationProps.successFrame){
  validationProps.successFrame = World.frameCount;
}

// Pass 250 frames after success or when all sprites infected
if(sickSpritesIncreased){
  if ((World.frameCount > validationProps.successFrame + waitTime) || (countByAnimation({costume: "healthy"}) === 0)) {
  levelFailure(0,"outbreakReplaySuccess");
  }
}

// Fail if 300 frames with no increase in sick sprites
if (World.frameCount > failTime && !sickSpritesIncreased) {
  //console.log("outbreakSubjectPointer - Fill the empty spot in the `change costume` block with the subject block.");
  levelFailure(3, "outbreakSubjectPointer");
}

//bars
push();
if(!sickSpritesIncreased){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successFrame)*400/waitTime),10);
}
pop();
