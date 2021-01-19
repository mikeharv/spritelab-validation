//https://levelbuilder-studio.code.org/levels/27338/edit
//1. Must have starter sprites
var starterSprites = true;

//3. All sprites must have a behavior (only wandering is available)
var spritesHaveBehaviors = false;

//4. Sun must rotate.
var sunRotated = false;

//5. Cloud must move (x).
//validationProps.cloudMoved

//6. Butterfly must move.
//validationProps.butterflyMoved

//5. Bonus - use 2+ behaviors on butterfly
var bonus = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=100;

//Check for starter sprites
starterSprites = (countByAnimation({costume: "sun_1"}) >= 1) && (countByAnimation({costume: "cloud_1"}) >= 1)&& (countByAnimation({costume: "butterfly_1"}) >= 1);

var missingBehavior = false;
  //Check for behavior (and bonus)
  for (var i = 0; i < animations.length; i++) {
    if(getNumBehaviorsForAnimation(animations[i]) === 0){
      missingBehavior=true;
    }
    if(getNumBehaviorsForAnimation(animations[i]) >= 2 && getProp({id: spriteIds[i]}, "costume")=="butterfly_1"){
      bonus = true;  
    }
  }
if(!missingBehavior){
  spritesHaveBehaviors=true;
}


//Check sun rotation
if(!sunRotated){
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "rotation") != 0) && (getProp({id: spriteIds[i]}, "costume")=="sun_1")) {
      sunRotated=true;
    }
  }
}

//Check for updated position of cloud and butterfly
var cloudX=validationProps.cloudX;
var butterflyX=validationProps.butterflyX;
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "costume")=="cloud_1") {
    if(cloudX&&(cloudX!=getProp({id: spriteIds[i]}, "x"))){
      validationProps.cloudMoved=true;
    }
    validationProps.cloudX=getProp({id: spriteIds[i]}, "x");
  }
  if (getProp({id: spriteIds[i]}, "costume")=="butterfly_1") {
    if(butterflyX&&(butterflyX!=getProp({id: spriteIds[i]}, "x"))){
      validationProps.butterflyMoved=true;
    }
    validationProps.butterflyX=getProp({id: spriteIds[i]}, "x");
  }
}



if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (!spritesHaveBehaviors) {
    console.log("Make sure all sprites have a behavior.");
    levelFailure(3, "allBehaviors");
  } else if (!sunRotated) {
    console.log("The sun didn't rotate. Try a different behavior.");
    levelFailure(3, "sunDidntRotate");
  } else if (!validationProps.cloudMoved) {
    console.log("The cloud didn't move. Try a different behavior.");
    levelFailure(3, "cloudDidntMove");
  } else if (!validationProps.butterflyMoved) {
    console.log("The butterfly didn't move. Try a different behavior.");
    levelFailure(3, "butterflyDidntMove");
  } 
}

//if we haven’t failed yet, pass
var waitTime=200;
if (World.frameCount > waitTime) {
  if(bonus){
    console.log("Bonus");
    levelFailure(0, "genericBonusSuccess");
  } else {
    console.log("Standard success");
  levelFailure(0, "outbreakSuccess");
}
}

if(!starterSprites||!sunRotated||!validationProps.cloudMoved||!validationProps.butterflyMoved){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
