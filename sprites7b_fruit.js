//https://levelbuilder-studio.code.org/levels/27337/edit
//1. Must have starter sprites
var starterSprites = true;

//2. Banana must change size.
var bananaChanged = false;

//3. Strawberries must change size.
var strawberriesChanged = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check starter sprites
starterSprites = (countByAnimation({costume: "face_banana_1"}) >= 1) && (countByAnimation({costume: "face_strawberry_1"}) >= 3);

//Check bananas and strawberries
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "scale") > 100) && (getProp({id: spriteIds[i]}, "costume")=="face_banana_1")) {
      bananaChanged = true;
    } else if (getProp({id: spriteIds[i]}, "scale") < 100 && getProp({id: spriteIds[i]}, "costume")=="face_strawberry_1") {
      strawberriesChanged = true;
    }
  }



  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else if (!bananaChanged) {
    console.log("Use a `set size` block to make the banana sprite bigger.");
    levelFailure(3, "bananaUnchanged");
  } else if (!strawberriesChanged) {
    console.log("Use a 'set size block to make the strawberry sprites smaller.");
    levelFailure(3, "strawberryUnchanged");
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
