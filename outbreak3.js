//https://levelbuilder-studio.code.org/levels/24540/edit
//1. Number of healthy_mask sprites must increase from the first frame. 
var healthyMasksIncreased = false;

//2. Number of healthy_mask sprites must increase from the first frame. 
var sickMasksIncreased = false;

//Declare helper variables
var waitTime = 200;
var failTime=300;

//Logic for criteria #1
if(validationProps.lastSickCount<countByAnimation({costume: "healthy_mask"})){
  healthyMasksIncreased = true;
} else {
  validationProps.lastSickCount = countByAnimation({costume: "healthy_mask"});
}

//Logic for criteria #2
if(validationProps.lastSickCount<countByAnimation({costume: "sick_mask"})){
  sickMasksIncreased = true;
} else {
  validationProps.lastSickCount = countByAnimation({costume: "sick_mask"});
}

// Record success time
if(healthyMasksIncreased && sickMasksIncreased && !validationProps.successFrame){
  validationProps.successFrame = World.frameCount;
}

// Pass waitTime frames after success or when all sprites have masks
if(healthyMasksIncreased && sickMasksIncreased){
  if ((World.frameCount > validationProps.successFrame + waitTime) || ((countByAnimation({costume: "healthy"}) === 0) && (countByAnimation({costume: "sick"}) === 0))) {
  levelFailure(0, "outbreakReplaySuccess");
  }
}

// Fail if 300 frames with no increase in sick sprites
if (World.frameCount > failTime){
  if(!healthyMasksIncreased) {
    //console.log("outbreakClickHealthy - No healthy monsters were wearing masks. Click the sprites after pressing Run and make sure you have the right code:");
    levelFailure(3, "outbreakClickHealthy");
  } else if(!sickMasksIncreased) {
    //console.log("outbreakClickSick - No sick monsters were wearing masks. Click the sprites after pressing Run and make sure you have the right code:");
    levelFailure(3, "outbreakClickSick");
  }
}

//bars
push();
if(!healthyMasksIncreased || !sickMasksIncreased){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successFrame)*400/waitTime),10);
}
pop();
