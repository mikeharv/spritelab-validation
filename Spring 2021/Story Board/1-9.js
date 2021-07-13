if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    differentCostumes: false,
    numSpritesClicked: 0,
    numSpriteClicksCauseSpeech: 0
  };
}

if (!validationProps.previous) {
  validationProps.previous = {
    waitTime: 120
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();

// Check for at least 3 different sprites
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

// Keeps track of which sprites were clicked on
if(!validationProps.spritesClickedOn) {
  validationProps.spritesClickedOn = [];
}

// Keeps track of which sprites caused speech on click
if(!validationProps.spriteClicksCauseSpeech) {
  validationProps.spriteClicksCauseSpeech = [];
}

// Helper function
// returns true if spriteId is in spriteIdArray
function member(spriteId, spriteIdArray) {
  for (var i = 0; i < spriteIdArray.length; i++) {
    if (spriteIdArray[i] == spriteId) {
      return true;
    }
  }
  return false;
}

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  // check eventLog for WhenClick or WhileClick event
  var currentEvent = eventLog[eventLog.length - 1];

  if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
    // current event is a click
    var clickedSpriteId = parseInt(currentEvent.split(" ")[1]);
    validationProps.spritesClickedOn.push(clickedSpriteId);
    validationProps.successCriteria.numSpritesClicked = validationProps.spritesClickedOn.length;
    
    if (!member(clickedSpriteId, validationProps.spriteClicksCauseSpeech)) {
      var newSpriteSpeaking = false;
      for (var spriteId in spriteIds) {
        if (getProp({id: spriteId}, "speech") && getProp({id: spriteId}, "timeout")==120) {
          // new sprite caused speech in some sprite
          newSpriteSpeaking = true;
          break;
        }
      }
      if (newSpriteSpeaking) {
        validationProps.spriteClicksCauseSpeech.push(clickedSpriteId);
      	validationProps.successCriteria.numSpriteClicksCauseSpeech = validationProps.spriteClicksCauseSpeech.length;
      }
    }
  }
}

// Store previous values
validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.waitTime = validationProps.waitTime;

// Set success time if success
if (validationProps.successCriteria.threeSprites &&
    validationProps.successCriteria.differentCostumes &&
    validationProps.successCriteria.numSpritesClicked>=3 &&
    validationProps.successCriteria.numSpriteClicksCauseSpeech>=3 &&
    !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.threeSprites) {
    levelFailure(3, "createAtLeastThreeSprites");
  } else if (!validationProps.successCriteria.differentCostumes) {
    levelFailure(3, "spritesNeedUniqueCostumes");
  } 
}

if (World.frameCount > failTime) {
  if (validationProps.successCriteria.numSpritesClicked == 0) {
    // did not click on any sprite
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 0) {
    // student clicked on a sprite, but the click did not cause speech
    console.log("You clicked a sprite but none of the sprites said anything. Add the `say` block to your `when clicked` event.");
    levelFailure(3, "clickButNoSpeech");
  } else if (validationProps.successCriteria.numSpritesClicked == 1) {
    // did not click on 2 or 3 sprites
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 1) {
    // student clicked on a second sprite, but the second click did not cause speech
    console.log("You clicked on more than one sprite but one of your clicks didn't cause a sprite to say anything. Add a `say` block under each `when clicked` event.");
    levelFailure(3, "secondClickButNoSpeech");
  } else if (validationProps.successCriteria.numSpritesClicked == 2) {
    // did not click on 3 sprites
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCauseSpeech == 2) {
    // student clicked on a third sprite, but the third click did not cause speech
    console.log("You clicked on more than two sprites but one of your clicks didn't cause a sprite to say anything. Add a `say` block under each `when clicked` event.");
    levelFailure(3, "thirdClickButNoSpeech");
  } 
}

if (World.frameCount - validationProps.successTime >= validationProps.waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (validationProps.successCriteria.numSpriteClicksCauseSpeech<3) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/validationProps.waitTime),10);
}
pop();
