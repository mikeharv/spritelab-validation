//https://levelbuilder-studio.code.org/levels/24538/edit
//1. Must have > 10 *healthy* sprites
var made10Healthy = false;

//2. Must have > 1 *sick* sprite
var madeSick = false;

//3. Sprites must have scale <= 50
var existsSpriteTooLarge = false;

//4. All sprites must have a behavior (only wandering is available)
var bothCostumesHaveBehavior = false;

//Declare variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();
var waitTime=100;
var failTime=50;


//Check for 10 healthy sprites
made10Healthy = countByAnimation({costume: "healthy"}) >= 10;

//Check for sick sprite
madeSick = countByAnimation({costume: "sick"}) >= 1;  

//Check sprite scale
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "scale") > 50) {
    existsSpriteTooLarge = true;
  }
}

  //Check for wandering
if (animations.length === 2 &&
  getNumBehaviorsForAnimation(animations[0]) >= 1 &&
  getNumBehaviorsForAnimation(animations[1]) >= 1) {
  bothCostumesHaveBehavior = true;
}

if (World.frameCount > failTime) {
  // Check each criteria and give failure feedback
  if (!made10Healthy) {
    //console.log("outbreakMakeHealthySprites - Use this block to create your healthy monster sprites:");
    levelFailure(3, "outbreakMakeHealthySprites");
  } else if (!madeSick) {
    //console.log("outbreakMakeUnhealthySprite - Now create one sick monster sprite using");
    levelFailure(3, "outbreakMakeUnhealthySprite");
  } else if (existsSpriteTooLarge) {
    //console.log("outbreakSetSizeBlock - Your sprites are too big. Set the size of the sprites to 50 (or less) with");
    levelFailure(3, "outbreakSetSizeBlock");
  } else if (!bothCostumesHaveBehavior) {
    //console.log("outbreakWander - Your sprites need to move. Make all sprite begin wandering with");
    levelFailure(3, "outbreakWander");
  }
}

//if we haven’t failed yet, pass
if (World.frameCount > waitTime) {
  levelFailure(0,"outbreakSuccess");
  //levelSuccess(0);
}

//bars
push();
if(!made10Healthy||!madeSick||existsSpriteTooLarge||!bothCostumesHaveBehavior){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
pop();
