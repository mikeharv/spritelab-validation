//1. Must have == 1 sprites
var starterSprites = false;
var tooManySprites = false;

//2. Sprite must remain stationary for 8 seconds
var spriteStationary = true;

//3. All sprites must move and have a behavior after 8 seconds
var success = false;


//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();
if(!validationProps.x){validationProps.x=getProp({id: spriteIds[0]}, "x");}
if(!validationProps.y){validationProps.y=getProp({id: spriteIds[0]}, "y");}
var spriteMoved = false;

var failTime=10;

//Check for sprites
if(spriteIds.length == 1){
  starterSprites=true;
  tooManySprites=false;
} else if(spriteIds.length>1){
  starterSprites=true;
  tooManySprites=true;
} else {
  starterSprites=false;
  tooManySprites=false;
}

//Check for sprite moving too early
if(getProp({id: spriteIds[0]}, "x")!=validationProps.x||getProp({id: spriteIds[0]}, "y")!=validationProps.y){
  spriteMoved=true;
  if(World.seconds<8){
    spriteStationary=false;
  } else if(getNumBehaviorsForAnimation(animations[0]) >= 1){
    success=true;
    if(!validationProps.successTime){
      validationProps.successTime=World.frameCount;
    }
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (tooManySprites) {
    console.log("too many sprites");
    levelFailure(3, "tooManySprites");
  } else if (!spriteStationary) {
    console.log("the sprite moved too soon");
    levelFailure(3, "spriteMovedTooSoon");
  }
}

//Fail at 8 seconds if we haven't succeeded
if (!success && World.seconds > 8) {
  stopSound();
  console.log("ship did not move");
  levelFailure(3, "shipStayedInBounds");
}


//Pass after 10 seconds
var waitTime=100;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Standard success");
    levelFailure(0, "genericSuccess");
  } 

push();
if(!starterSprites||tooManySprites||!spriteStationary){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else if (!success){
  fill(rgb(118,102,160));
  rect(0,390,(World.seconds*400/8),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
