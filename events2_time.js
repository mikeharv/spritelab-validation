//1. Must have == 1 sprites
var starterSprites = false;

//2. One sprite must have an increase in number of behaviors sometime after Run
var behaviorsIncreased = false;


//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=10;

//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}

//Check for increase in behaviors
var currentBehaviors=0;
for (var i = 0; i < animations.length; i++) {
  //tally up all behaviors on any animation
  currentBehaviors+=getNumBehaviorsForAnimation(animations[i]);
}
if(validationProps.behaviors<currentBehaviors){
  behaviorsIncreased=true;
} else {
  validationProps.behaviors=currentBehaviors;
}

if(!validationProps.successTime&&behaviorsIncreased){
  validationProps.successTime=World.frameCount;
}


if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } 
}



//Fail at 8 seconds if we haven't succeeded
if (!behaviorsIncreased && World.seconds > 10) {
  console.log("Your sprite didn't begin a new behavior. ");
  levelFailure(3, "noNewBehavior");
}


//Pass 100 frames after success
var waitTime=100;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Explore success");
    levelFailure(0, "genericExplore");
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
if(!starterSprites){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else if (!behaviorsIncreased){
  fill(rgb(118,102,160));
  rect(0,390,((World.seconds*400/10)+1),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
