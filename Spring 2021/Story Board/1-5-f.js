//Gabrielle - This code's "bonus" criteria is checking for a sprite with 2+ behaviors. Instead, a "bonus" pass should be for a sprite that begins a behavior after the program has started running (with events).

if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
  	starterSprite: false,
    spriteHasBehavior: false,
    spriteHasBehaviorEvent: false
  };
}

if (!validationProps.previous) {
  validationProps.previous = {};
}

// Keep track of sprites' current number of behaviors
if(!validationProps.numSpritesBehaviors) {
  validationProps.numSpritesBehaviors = {};
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();
var eventLog = getEventLog();

// Check for a sprite
if (!validationProps.successCriteria.starterSprite) {
  validationProps.successCriteria.starterSprite = spriteIds.length>=1;
}

if (World.frameCount == 1) {
  console.log("IMMEDIATELY");
  for (var i=0; i<animations.length; i++) {
    console.log("animation[i]: " + animations[i]);
    console.log("num behaviors for " + animations[i] + ": " + getNumBehaviorsForAnimation(animations[i]));
    if(getNumBehaviorsForAnimation(animations[i]) >= 1){
      validationProps.successCriteria.spriteHasBehavior = true;
    }
    validationProps.numSpritesBehaviors[animations[i]] = getNumBehaviorsForAnimation(animations[i]);
  }
} else {
  // Check if new event happened
  if ((eventLog.length > validationProps.previous.eventLogLength) && !validationProps.successCriteria.spriteHasBehaviorEvent) {
    var currentEvent = eventLog[eventLog.length - 1];
    // check eventLog for WhenClick or WhileClick event
    if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
      for (var i=0; i<animations.length; i++) {
        console.log("animations[i]: " + animations[i]);
        if(getNumBehaviorsForAnimation(animations[i]) > validationProps.numSpritesBehaviors[animations[i]]){
          validationProps.successCriteria.spriteHasBehaviorEvent = true;
        }
        validationProps.numSpritesBehaviors[animations[i]] = getNumBehaviorsForAnimation(animations[i]);
      }
    }
  }
}

// Store previous event log length
validationProps.previous.eventLogLength = eventLog.length;

// Set success time if success
if ((validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.spriteHasBehavior) ||
    (validationProps.successCriteria.starterSprite &&
    validationProps.successCriteria.spriteHasBehaviorEvent) &&
    !validationProps.successTime)
{
  validationProps.successTime = World.frameCount;
}

var earlyFailTime = 10;
var failTime = 150;

if (World.frameCount > earlyFailTime) {
  if (!validationProps.successCriteria.starterSprite) {
    console.log("You need to make a sprite.");
  	levelFailure(3, "noSprites");
  }
}

if (World.frameCount > failTime) {
  if (!validationProps.successTime) {
    // fail
    console.log("Your sprite needs a behavior.");
  	levelFailure(3, "noBehavior");
  } else if (validationProps.successCriteria.spriteHasBehaviorEvent) {
    // bonus pass
    console.log("Great job! You've finished the level, including the extra challenge!");
    levelFailure(0, "genericBonusSuccess");
  } else if (validationProps.successCriteria.spriteHasBehavior) {
    // pass
    console.log("Generic success");
    levelFailure(0, "genericSuccess");
  }
}

push();
stroke("white");
if (!validationProps.successCriteria.starterSprite) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/earlyFailTime),10);
} else if (!validationProps.successTime) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
  fill(rgb(0,173,188));
  rect(0,390,((World.frameCount)*400/failTime),10);
}
pop();


/*
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    madeSprite: false,
    spriteHasBehavior: false,
    bonus: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

var failTime=10;

// Check for sprites
if (!validationProps.successCriteria.madeSprite) {
  validationProps.successCriteria.madeSprite = (spriteIds.length >= 1);
}


// Check for behavior
if (validationProps.successCriteria.madeSprite) {
  for (var i = 0; i < animations.length; i++) {
    if(getNumBehaviorsForAnimation(animations[i]) >= 1){
      validationProps.successCriteria.spriteHasBehavior = true;
    }
    if(getNumBehaviorsForAnimation(animations[i]) >= 2){
      validationProps.successCriteria.bonus = true;
    }
  }
}

if (World.frameCount > failTime) {
  // Check criteria and give failure feedback
  if (!validationProps.successCriteria.madeSprite) {
    levelFailure(3, "starterSprites");
  } else if (!validationProps.successCriteria.spriteHasBehavior) {
    levelFailure(3, "noBehavior");
  }
}

//if we haven’t failed yet, pass
var waitTime=150;
if (World.frameCount > waitTime) {
  if(validationProps.successCriteria.bonus){
    levelFailure(0, "genericBonusSuccess");
  } else {
  	levelFailure(0, "genericExplore");
  }
}

if(!validationProps.successCriteria.madeSprite || !validationProps.successCriteria.spriteHasBehavior) {
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,(World.frameCount*400/waitTime),10);
}
*/






