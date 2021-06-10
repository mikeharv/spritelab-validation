if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    // Don't need to check for starter sprite since that block cannot be removed
    stoppedOldBehaviors: true,
    correctBehaviorCount: false
  };
}

//Helper variables
var spriteIds = getSpriteIdsInUse();
var behaviors = getBehaviorsForSpriteId(spriteIds[0]);

// Check for correct behaviors
if (!validationProps.previousBehaviors) {
  validationProps.previousBehaviors = behaviors;
}
if (!validationProps.currentBehaviors && (World.seconds >= 2)) {
  validationProps.currentBehaviors = behaviors;
}
if (behaviors.length == 5) {
  validationProps.successCriteria.stoppedOldBehaviors = false;
}

// Were all old behaviors stopped before starting the new behaviors?
if (validationProps.previousBehaviors && validationProps.currentBehaviors) {
  validationProps.successCriteria.correctBehaviorCount = ((validationProps.previousBehaviors[0] != validationProps.currentBehaviors[0]) && (validationProps.currentBehaviors.length == 3));
}

if (!validationProps.successTime && validationProps.successCriteria.correctBehaviorCount) {
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.stoppedOldBehaviors) {
    console.log("Your sprite started a new behavior but did not stop the old behavior. Make sure the `stops everything` block is connected to your code.");
    levelFailure(3, "behaviorNotStopped");
  } else if (!validationProps.successCriteria.correctBehaviorCount) {
    console.log("Wrong behaviors. Use stop block.");
    levelFailure(3, "eventsWrongBehaviors");
  }
}

// Pass 100 frames after success
var waitTime = 200;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

// bars
push();
stroke("white");
if (!validationProps.successCriteria.correctBehaviorCount){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();