//https://levelbuilder-studio.code.org/levels/24541/edit
//1. Must have != 10 *healthy* sprites
var changedCount = false;

//2. Must have > 1 *sick* sprite
var madeSick = false;

//3. Sprites must have scale != 50
var spritesWrongSize = false;

//Declare helper variables
var spriteIds = getSpriteIdsInUse();
var waitTime = 300;
var failTime = 50;

//Logic for each criteria
if (World.frameCount > failTime) {
  //Check for !11 sprites. (Can't check per costume because there could be collision at first frame)
  changedCount = countByAnimation({costume: "healthy"}) +countByAnimation({costume: "sick"}) != 11;
 
  //Check for sick sprite
  madeSick = countByAnimation({costume: "sick"}) >= 1;  

  //Check sprite scale
  for (var i = 0; i < spriteIds.length; i++) {
    if (getProp({id: spriteIds[i]}, "scale") == 50) {
      spritesWrongSize = true;
    }
  }
  
  // Check criteria and give failure feedback
  if (!changedCount) {
    console.log("outbreakChangeHealthy - Try making a different number of sprites.");
    levelFailure(3, "outbreakChangeHealthy");
  } else if (!madeSick) {
    console.log("outbreakMakeUnhealthySprite - Now create one sick monster sprite using");
    levelFailure(3, "outbreakMakeUnhealthySprite");
  } else if (spritesWrongSize) {
    console.log("outbreakChangeSize - Try setting your sprites to a different size.");
    levelFailure(3, "outbreakChangeSize");
  } }

//if we haven’t failed yet, pass
if (World.frameCount > waitTime) {
  levelFailure(0,"outbreakReplaySuccess");
}

//bars
push();
if(!changedCount || !madeSick || spritesWrongSize){
  fill(rgb(254,184,29));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
pop();
