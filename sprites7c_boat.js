//https://levelbuilder-studio.code.org/levels/27336/edit
//1. Must have >= 1 sprites
var madeSprite = false;

//2. Initial sprite position must be >250;
var spriteGoodPosition=validationProps.spriteGoodPosition;

//3. Sprites must have x <= -10 or >= 410
var spriteMovedOff = validationProps.spriteMovedOff;

//4. All sprites must have a behavior (only wandering is available)
var spriteHasBehavior = false;

//5. Bonus - use two behaviors
var bonus = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=100;

//Check for sprites
madeSprite = (animations.length >= 1);



//Check sprite position
if(!spriteGoodPosition){
for (var i = 0; i < spriteIds.length; i++) {
    if (getProp({id: spriteIds[i]}, "y") > 250) {
      validationProps.spriteGoodPosition = true;
      spriteGoodPosition=true;
    }
  }
}
spriteMovedOff=validationProps.spriteMovedOff;
if(!spriteMovedOff){
for (var i = 0; i < spriteIds.length; i++) {
    if (getProp({id: spriteIds[i]}, "x") > 410 || getProp({id: spriteIds[i]}, "x") < -10) {
      validationProps.spriteMovedOff = true;
    }
  }
}
spriteMovedOff=validationProps.spriteMovedOff;

  //Check for behavior
var behaviorFound=false;
for (var i = 0; i < animations.length; i++) {
  if(getNumBehaviorsForAnimation(animations[i]) >= 1){
    spriteHasBehavior = true;  
  }
  if(getNumBehaviorsForAnimation(animations[i]) >= 2){
    bonus = true;  
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!madeSprite) {
    console.log("No sprites");
    levelFailure(3, "noSprites");
  } else if (!spriteGoodPosition) {
    console.log("Bad placement");
    levelFailure(3, "shipBadPosition");
  } else if (!spriteHasBehavior) {
    console.log("No behavior");
    levelFailure(3, "noBehavior");
  } else if (!spriteMovedOff) {
    console.log("Sprite didn’t move off");
    levelFailure(3, "shipStayedInBounds");
  } 
}

//if we haven’t failed yet, pass
var waitTime=150;
if (World.frameCount > waitTime) {
  if(bonus){
    console.log("Bonus");
    levelFailure(0, "genericBonusSuccess");
  } else {
    console.log("Standard success");
  levelFailure(0, "outbreakSuccess");
}
}

if(!madeSprite||!spriteGoodPosition||!spriteMovedOff||!spriteHasBehavior){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
