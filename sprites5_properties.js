//https://levelbuilder-studio.code.org/levels/27344/edit
//1. Starter sprites should still exist.
var starterSprites = false;

//2. flower1 should have size !=100
var flower1ChangedSize = false;

//3. flower2 should have size !=100
var flower2ChangedSize = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check starter sprites
starterSprites = (countByAnimation({costume: "flower1_1"}) >= 1) && (countByAnimation({costume: "flower2_1"}) >= 1);

//Check sprite locations
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "scale") != 100) && (getProp({id: spriteIds[i]}, "costume") == "flower1_1")) {
      flower1ChangedSize = true;
    } else if ((getProp({id: spriteIds[i]}, "scale") != 100) && (getProp({id: spriteIds[i]}, "costume") == "flower2_1")) {
      flower2ChangedSize = true;
    } 
  }

  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "debugSprites");
  } else if (!flower1ChangedSize && flower2ChangedSize) {
    console.log("Use a `set size` block for each sprite.");
    levelFailure(3, "useTwoSetpropBlocks");
  } else if (!flower2ChangedSize) {
    console.log("Use a `set size` block to change the size of the second sprite. Use a size other than 100.");
    levelFailure(3, "setSecondSpriteSize");
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
