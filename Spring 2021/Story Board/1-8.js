if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    differentCostumes: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {
  	waitTime: 120
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();

// Check for at least 3 sprites
validationProps.successCriteria.threeSprites = spriteIds.length>=3;

//Check sprite costumes
if(validationProps.successCriteria.threeSprites){
  if (getProp({id: spriteIds[0]}, "costume")!=getProp({id: spriteIds[1]}, "costume") &&
      getProp({id: spriteIds[1]}, "costume")!=getProp({id: spriteIds[2]}, "costume") &&
      getProp({id: spriteIds[0]}, "costume")!=getProp({id: spriteIds[2]}, "costume")) {
    validationProps.successCriteria.differentCostumes=true;
  }
}

// Check if student is interacting with the program
// version 1
for (var spriteId in spriteIds) {
  if (getProp({id: spriteId}, "timeout")>0) {
    validationProps.waitTime = World.frameCount + 60;
    break;
  } else {
    validationProps.waitTime = validationProps.previous.waitTime;
  }
}

/*
// version 2
if (validationProps.successTime && (eventLog.length > validationProps.previous.eventLogLength)) {
  validationProps.waitTime = World.frameCount + 100;
} else {
  validationProps.waitTime = validationProps.previous.waitTime;
}
*/

//validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.waitTime = validationProps.waitTime;

// Set success time if success
if (validationProps.successCriteria.threeSprites && 
    validationProps.successCriteria.differentCostumes && 
   	!validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}


var failTime = 150;
// Check criteria and give failure feedback 
if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.threeSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  }
}

if (World.frameCount - validationProps.successTime >= validationProps.waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.threeSprites ||
    !validationProps.successCriteria.differentCostumes) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/validationProps.waitTime),10);
}
pop();
