//https://levelbuilder-studio.code.org/levels/27345/edit
//1. Must have >= 1 sprites
var madeSprite = false;

//4. All sprites must have a behavior
var spriteHasBehavior = false;

//5. Bonus - use two behaviors
var bonus = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=10;

//Check for sprites
madeSprite = (animations.length >= 1);


  //Check for behavior

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
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (!spriteHasBehavior) {
    console.log("No behavior");
    levelFailure(3, "noBehavior");
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
  levelFailure(0, "genericExplore");
}
}

if(!madeSprite||!spriteHasBehavior){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
