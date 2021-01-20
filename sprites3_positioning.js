//https://levelbuilder-studio.code.org/levels/27341/edit
//1. Must have >= 1 sprites
var madeSprite = false;

//2. Must have non-default location for sprite
var movedSprite = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

//Check for sprites
madeSprite = (animations.length >= 1);

//Check sprite position
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "x") != 200) || (getProp({id: spriteIds[i]}, "y") != 200)) {
      movedSprite = true;
    }
  }



  // Check criteria and give failure feedback
  if (!madeSprite) {
    console.log("You need to make more sprites");
    levelFailure(3, "noSprites");
  } else if (!movedSprite) {
    console.log("Use the location block to move your sprite on the screen");
    levelFailure(3, "changeLocation");
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
