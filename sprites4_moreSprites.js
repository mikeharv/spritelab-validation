//https://levelbuilder-studio.code.org/levels/27346/edit
//1. Must have 4 sprites
var fourSprites = false;

//2. Must have sprite in each quadrant
var topLeft = false;
var topRight = false;
var bottomLeft = false;
var bottomRight = false;

//Bonus - change a sprite's size
var bonus = false;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Count Sprites
fourSprites = spriteIds.length >= 4;

//Check sprite locations
for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "x") < 200) && (getProp({id: spriteIds[i]}, "y") > 200)) {
      topLeft = true;
    } else if ((getProp({id: spriteIds[i]}, "x") > 200) && (getProp({id: spriteIds[i]}, "y") > 200)) {
      topRight = true;
    } else if ((getProp({id: spriteIds[i]}, "x") < 200) && (getProp({id: spriteIds[i]}, "y") < 200)) {
      bottomLeft = true;
    } else if ((getProp({id: spriteIds[i]}, "x") > 200) && (getProp({id: spriteIds[i]}, "y") < 200)) {
      bottomRight = true;
    }
  if (getProp({id: spriteIds[i]}, "scale") != 100) {
      bonus = true;
    }
  }

var shouldPass=topLeft&&topRight&&bottomLeft&&bottomRight;

  // Check criteria and give failure feedback
  if (!fourSprites) {
    console.log("You need to make more sprites");
    levelFailure(3, "moreSprites");
  } else if (!topLeft) {
    console.log("Move one of your sprites into the top left of the screen.");
    levelFailure(3, "topLeft");
  } else if (!topRight) {
    console.log("Move one of your sprites into the top right of the screen.");
    levelFailure(3, "topRight");
  } else if (!bottomLeft) {
    console.log("Move one of your sprites into the bottom left of the screen.");
    levelFailure(3, "bottomLeft");
  } else if (!bottomRight) {
    console.log("Move one of your sprites into the bottom right of the screen.");
    levelFailure(3, "bottomRight");
  } else if (bonus) {
    console.log("Bonus success");
    levelFailure(0, "genericBonusSuccess");
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
