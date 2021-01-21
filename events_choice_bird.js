//1. If seconds >=2 sprite should have 3 behaviors
var correctBehaviorCount = false;

//2. Sprite should "fly" off the top of the screen
var spriteMovedOff =false;



//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();


//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}

//Check for behaviors
correctBehaviorCount=(getNumBehaviorsForAnimation(animations[0])==3)&&(World.seconds>=2);

//Check for sprite y position
var spriteMovedOff=getProp({id: spriteIds[0]}, "x")>400;



//Delay fail time (so student can observe the wrong animation)
var failTime=10;

if(!validationProps.failTime&&!correctBehaviorCount){
  validationProps.failTime=World.frameCount+100;
}
if(validationProps.failTime){
  failTime=validationProps.failTime;
}

// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!correctBehaviorCount){
    console.log("Wrong behaviors. Use stop block.");
    levelFailure(3, "debugBehaviors");
  }
}



/*Fail at 8 seconds if we haven't succeeded
if (behaviorsIncreased && World.seconds > 10) {
  console.log("Your sprite didn't begin a new behavior. ");
  levelFailure(3, "debugBehaviors");
}*/


//Pass 100 frames after success
var waitTime=200;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Generic success");
    levelFailure(0, "genericSuccess");
  }

if(!validationProps.successTime&&correctBehaviorCount){
  validationProps.successTime=World.frameCount;
}

//special timer for this level
push();

push();
var timerX=30;
var timerY=360;

  noStroke();
  fill("white");
  ellipse(timerX,timerY,32,32);
  stroke("white");
  strokeWeight(7);
  line(timerX,timerY-22,timerX,timerY-10);
  stroke("black");
  strokeWeight(3);
  line(timerX,timerY-20,timerX,timerY-10);
  ellipse(timerX, timerY, 25, 25);
  fill("black");
  noStroke();
  arc(timerX,timerY,18,18,45,270);
  stroke("white");
  textAlign(CENTER, TOP);
  strokeWeight(5);
  textSize(20);
  text(World.seconds,timerX+30,timerY);
pop();

if (!correctBehaviorCount){
  fill(rgb(118,102,160));
  rect(0,390,((World.seconds*400/10)+1),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
