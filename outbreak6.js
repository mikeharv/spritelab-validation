//https://levelbuilder-studio.code.org/levels/24546/edit
//1. An animation with a name not in the list is used.
var usedNewCostume = false;

//Declare helper variables
var animations = getAnimationsInUse();
var defaultCostumes = ["healthy", "sick", "healthy_mask", "sick_mask"];
var waitTime=250;
var failTime=300;

//Logic for criteria #1
var foundMatch=false;

for(var i=0; i<animations.length;i++){
  if(countByAnimation({costume: "healthy_copy_1"})>0 || countByAnimation({costume: "animation_1"})>0){
    validationProps.shouldPass=true;
  }
}
usedNewCostume=validationProps.shouldPass;

// Record success time
if(usedNewCostume && !validationProps.successFrame){
  validationProps.successFrame = World.frameCount;
}

// Pass 250 frames after success
if(usedNewCostume){
  if (World.frameCount > validationProps.successFrame + waitTime) {
  levelFailure(0, "outbreakReplaySuccess");
  }
}

// Fail if 300 frames with no increase in sick sprites
if ((World.frameCount > failTime) && !usedNewCostume) {
  //console.log("outbreakUseCostume - Your new sprite costume didn't show up in your simulation. Click the lightbulb if you would like a hint.");
  levelFailure(3, "outbreakUseCostume");
}

//bars
push();
if(!usedNewCostume){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successFrame)*400/waitTime),10);
}
pop();
