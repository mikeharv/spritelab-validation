//1. Must have == 1 sprites
var starterSprites = false;

//2. Any sprite must have scale != 100
var changedSize=false;

//3. One sprite must have a behavior
var hasBehavior = false;


//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=10;

//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}

//Check for sprites getting resized
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "scale") != 100)) {
      changedSize = true;
    } 
  }

//Check for behaviors
var currentBehaviors=0;
for (var i = 0; i < animations.length; i++) {
  if(getNumBehaviorsForAnimation(animations[i])>=1){
  	hasBehavior=true;
  	if(!validationProps.successTime){
    	validationProps.successTime=World.frameCount;
    }
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!starterSprites) {
    levelFailure(3, "noSprites");
  } else if (!changedSize) {
    levelFailure(3, "setSecondSpriteSize");
  } else if (!hasBehavior) {
    levelFailure(3, "noBehavior");
  }
}



//Pass 100 frames after success
var waitTime=150;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Explore success");
    levelFailure(0, "genericExplore");
  }

push();
var array=getBehaviorsForSpriteId(spriteIds[0]);
if(array.length===0){
  array=["none"];
}
textAlign(LEFT, TOP);
textSize(20);
noStroke();
text("Current Behaviors:",10,25);

for(var i=0;i<array.length;i++){
  text(array[i],10,50+i*25);
}
pop();

//timer
if(!starterSprites||!hasBehavior||!changedSize){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
