//https://levelbuilder-studio.code.org/levels/24542/edit
//1. The first sick sprite should be recovering. [REMOVED AS CONDITION 11/24/20]
//var initialRecovery = false;

//2. Additional sprites should start recovering.
var increasedRecovery = false;

//Declare helper variables
var spriteIds = getSpriteIdsInUse();
var waitTime=350;
var failTime=300;

//Condition 1 Logic
/*if(!validationProps.initial && (getProp({id: spriteIds[spriteIds.length-1]}, "recovery") == World.frameCount)){
  validationProps.initial=true;
}
initialRecovery=validationProps.initial;*/

//Condition 2 Logic
increasedRecovery=getProp({costume: "sick"}, "recovery")<World.frameCount;

// Record success time
if(increasedRecovery && !validationProps.successFrame){
  validationProps.successFrame = World.frameCount;
}

// Pass 350 frames after success
if(increasedRecovery){
  if ((World.frameCount > validationProps.successFrame + waitTime)) {
  levelFailure(0,"outbreakReplaySuccess");
  }
}

// Fail if 300 frames with no increase in "recovering" sprites
if (World.frameCount > failTime && !increasedRecovery) {
  /*if(!initialRecovery){
    console.log("outbreakOneRecovering - Make sure to use a `sprite begins recovering` block below the `when touches` event:");
    levelFailure(3, "outbreakNoneRecovering");
  } else {
    console.log("outbreakNoneRecovering - Make sure to use a `sprite begins recovering` block *after* the `make new sprites` block: ");*/
    levelFailure(3, "outbreakRecovering");
  //}
}

//bars
push();
if(!increasedRecovery){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successFrame)*400/waitTime),10);
}
pop();
