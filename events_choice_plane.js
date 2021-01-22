//1. Must have == 1 sprites
var starterSprites = false;

//2. Can't have increase no behaviors.
var noBehaviors = false;

//3. Must increase rotation at some point
var increasedRotation = validationProps.increasedRotation;

//4. Must decrease rotation at some point
var decreasedRotation = validationProps.decreasedRotation;

//5. Must press key
var pressedKey=validationProps.pressedKey;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();


//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}

//Check for no behaviors
noBehaviors=(getNumBehaviorsForAnimation(animations[0])===0);



//Check for rotation changes
var currentRotation=getProp({id: spriteIds[0]}, "rotation");
if(currentRotation>validationProps.rotation){
  validationProps.increasedRotation=true;
  //console.log("up");
} else if(currentRotation<validationProps.rotation){
  validationProps.decreasedRotation=true;
  //console.log("down");
}
validationProps.rotation=currentRotation;
increasedRotation = validationProps.increasedRotation;
decreasedRotation = validationProps.decreasedRotation;
if(increasedRotation&&decreasedRotation&&!validationProps.successTime){
  validationProps.successTime=World.frameCount;
}

//Check for ever pressing key
if(!validationProps.pressedKey){
  validationProps.pressedKey= keyWentDown("up")||keyWentDown("down")||keyWentDown("left")||keyWentDown("right");
}
pressedKey=validationProps.pressedKey;

//Delay fail time (so student can observe the wrong animation)
var failTime=10;
/*
if(!validationProps.failTime&&behaviorsIncreased){
  validationProps.failTime=World.frameCount+100;
}
if(validationProps.failTime){
  failTime=validationProps.failTime;
}*/

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (noBehaviors){
    console.log("Your sprite had no behaviors.");
    levelFailure(3, "noBehaviors");
  } else {
    failTime=300;
  }
}



//Fail at failTime frames if we haven't succeeded
if ((!decreasedRotation||!increasedRotation)&&World.frameCount > failTime) {
  if(!pressedKey){
    console.log("You didn't press a key");
    levelFailure(3, "didntPressKey");
  } else {
    console.log("Your sprite needs to spin both left and right.");
    levelFailure(3, "spinBothWays");
  }
}


//Pass 100 frames after success
var waitTime=100;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Generic success");
    levelFailure(0, "genericSuccess");
  }



//special timer for this level
push();


if(!decreasedRotation||!increasedRotation){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else if (!decreasedRotation||!increasedRotation){
  fill(rgb(118,102,160));
  rect(0,390,((World.seconds*400/10)+1),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
