if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    threeSprites: false,
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Helper variables
var animations = getAnimationsInUse();
var eventLog = getEventLog();
var printLog = getPrintLog();

// Check for at least 3 sprites
if (animations.length >= 3) {
  validationProps.successCriteria.threeSprites = true;
}

// Check if student is interacting with the program
if (validationProps.successTime && (eventLog.length > validationProps.previous.eventLogLength || printLog.length > validationProps.previous.printLogLength)) {
  validationProps.waitTime = World.frameCount + 60;
}

validationProps.previous.eventLogLength = eventLog.length;
validationProps.previous.printLogLength = printLog.length;

// Set success time if success
if (validationProps.successCriteria.threeSprites && 
   !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
  validationProps.waitTime = 60;
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.threeSprites) {
  levelFailure(3, "createAtLeastThreeSprites");
}

if (World.frameCount - validationProps.successTime >= validationProps.waitTime) {
  console.log("Generic success");
  levelFailure(0, "genericSuccess");
}

push();
stroke("white");
// Not checking for a fail condition since the student will fail at frame 1 if they don't create 3 sprites. This assumes we only show the success bar.
fill(rgb(0,173,188));
rect(0,390,((World.frameCount-validationProps.successTime)*400/validationProps.waitTime),10);
pop();
