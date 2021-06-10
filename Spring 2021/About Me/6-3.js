// give 5 seconds to click
// success: one click and longer print log

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprite: false,
    clickedSprite: false,
    printLogIncreased: false,
    clickCausesPrint: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var eventLog = getEventLog();
var printLog = getPrintLog();

// Check for at least 1 sprite
if (spriteIds.length >= 1) {
  validationProps.successCriteria.starterSprite = true;
}

var clickEvent = false;

// New event happened
if (eventLog.length > validationProps.previous.eventLogLength) {
  // check eventLog for WhenClick event
  var currentEvent = eventLog[eventLog.length - 1];

  if (currentEvent.includes("whenClick: ")) {
    // current event is a click
    validationProps.successCriteria.clickedSprite = true;
    clickEvent = true;
  }
}

// Check if print log increased
if (printLog.length > validationProps.previous.printLogLength) {
  validationProps.successCriteria.printLogIncreased = true;

  // check if click caused print
  if (clickEvent) {
    validationProps.successCriteria.clickCausesPrint = true;
  }
}

// Store previous event log and print log lengths
validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.printLogLength = printLog.length;

// Set success time if success
if (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.clickCausesPrint && 
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

// Delay fail time (so student can observe the wrong animation)
var earlyFailTime = 10;
var failTime = 150;

// Check criteria and give failure feedback
if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.starterSprite) {
    levelFailure(3, "noSprites");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successCriteria.clickedSprite) {
    // already existing feedback string
    console.log("Make sure that you click on each sprite and that you have the right events in your workspace.");
    levelFailure(3, "spriteNotClicked");
  } else if (!validationProps.successCriteria.printLogIncreased ||
             !validationProps.successCriteria.clickCausesPrint) {
    console.log("You clicked your sprite but no text was printed. Add the `print` block to your `when clicked` event.");
    levelFailure(3, "clickButNoPrint");
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
if (!validationProps.successCriteria.starterSprite ||
    !validationProps.successCriteria.clickCausesPrint) {
fill(rgb(118,102,160));
rect(0,390,(World.frameCount*400/failTime),10);
} else {
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
