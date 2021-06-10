if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
    numSpritesClicked: 0,
    numSpriteClicksCausePrint: 0,
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Keeps track of which sprites were clicked on
if(!validationProps.spritesClickedOn) {
  validationProps.spritesClickedOn = [];
}

// Keeps track of which sprites caused a print on click
if(!validationProps.spriteClickCausePrint) {
  validationProps.spriteClickCausePrint = [];
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

// Helper variables
var animations = getAnimationsInUse();
var eventLog = getEventLog();
var printLog = getPrintLog();

// Check for at least 3 different sprites
if (animations.length >= 3) {
  validationProps.successCriteria.threeSprites = true;
}

var clickedSpriteId = undefined;

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  // check eventLog for WhenClick event
  var currentEvent = eventLog[eventLog.length - 1];

  if (currentEvent.includes("whenClick: ")) {
    // current event is a click
    var spriteId = parseInt(currentEvent.split(" ")[1]);

    if (!member(spriteId, validationProps.spritesClickedOn)) {
      // new sprite was clicked on
      validationProps.spritesClickedOn.push(spriteId);
      validationProps.successCriteria.numSpritesClicked = validationProps.spritesClickedOn.length;
    }
    clickedSpriteId = spriteId;
  }
}

// Check if print log increased
if (printLog.length > validationProps.previous.printLogLength) {

  // check if click caused print
  if (clickedSpriteId != undefined && !member(clickedSpriteId, validationProps.spriteClickCausePrint)) {
      // new sprite click caused print
      validationProps.spriteClickCausePrint.push(clickedSpriteId);
      validationProps.successCriteria.numSpriteClicksCausePrint = validationProps.spriteClickCausePrint.length;
  }
}

// Store previous event log and print log lengths
validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.printLogLength = printLog.length;

// Set success time if success
if (validationProps.successCriteria.threeSprites &&
    validationProps.successCriteria.threeSpriteClickCausesPrint &&
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
  }
}

if (World.frameCount > failTime) {
  if (validationProps.successCriteria.numSpritesClicked == 0) {
    // did not click on any sprite
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCausePrint == 0) {
    console.log("You clicked your sprite but no text was printed. Add the `print` block to your `when clicked` event.");
    levelFailure(3, "clickButNoPrint");
  } else if (validationProps.successCriteria.numSpritesClicked == 1) {
    // did not click on 2 or 3 sprites
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCausePrint == 1) {
    // student clicked on a sprite and the print log increased, but the click did not cause the print
    console.log("You clicked on a second sprite but no text was printed. Add a `print` block under each `when clicked` event.");
    levelFailure(3, "secondClickButNoPrint");
  } else if (validationProps.successCriteria.numSpritesClicked == 2) {
    // did not click on 2 or 3 sprites
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (validationProps.successCriteria.numSpriteClicksCausePrint == 2) {
    // student clicked on a sprite and the print log increased, but the click did not cause the print
    console.log("You clicked on a third sprite but no text was printed. Add a `print` block under each `when clicked` event.");
    levelFailure(3, "thirdClickButNoPrint");
  }
}

// Pass 60 frames after success
var waitTime = 60;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
if (!validationProps.successCriteria.threeSprites ||
    !validationProps.successCriteria.threeSpriteClickCausesPrint) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
