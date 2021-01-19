//https://levelbuilder-studio.code.org/levels/27342/edit
//1. Must have a sprite
var madeSprites = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Count Sprites
madeSprites = spriteIds.length >= 1;

  // Check criteria and give failure feedback
  if (!madeSprites) {
    console.log("You need to make a sprite!");
    levelFailure(3, "noSprites");
  } else {
    console.log("Standard success");
  levelFailure(0, "genericSuccess");
}

/*
if(!madeSprite||!spriteGoodPosition||!spriteMovedOff||!spriteHasBehavior){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}

*/
