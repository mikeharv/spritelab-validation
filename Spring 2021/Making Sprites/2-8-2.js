if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    starterSprites: true,
    allBananasChanged: false,
    someBananasChanged: false,
    allStrawberriesChanged: false,
    someStrawberriesChanged: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Check starter sprites
validationProps.successCriteria.starterSprites = (countByAnimation({costume: "face_banana_1"}) >= 1) && (countByAnimation({costume: "face_strawberry_1"}) >= 3);

// Check banana sizes
var bananaSizes = [];
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "costume") == "face_banana_1") {
    bananaSizes.push(getProp({id: spriteIds[i]}, "scale"));
  }
}

var allBananasChangedSize = true;
var someBananasChangedSize = false;

for (var i = 0; i < bananaSizes.length; i++) {
  if (bananaSizes[i] > 100) {
  	someBananasChangedSize = true; 
  } else {
   	allBananasChangedSize = false; 
  }
}
validationProps.successCriteria.allBananasChanged = allBananasChangedSize;
validationProps.successCriteria.someBananasChanged = someBananasChangedSize;

// Check strawberry sizes
var strawberrySizes = [];
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "costume") == "face_strawberry_1") {
    strawberrySizes.push(getProp({id: spriteIds[i]}, "scale"));
  }
}

var allStrawberriesChangedSize = true;
var someStrawberriesChangedSize = false;

for (var i = 0; i < strawberrySizes.length; i++) {
  if (strawberrySizes[i] < 100) {
  	someStrawberriesChangedSize = true; 
  } else {
   	allStrawberriesChangedSize = false; 
  }
}
validationProps.successCriteria.allStrawberriesChanged = allStrawberriesChangedSize;
validationProps.successCriteria.someStrawberriesChanged = someStrawberriesChangedSize;

// Check criteria and give failure feedback
if (!validationProps.successCriteria.starterSprites) {
  levelFailure(3, "starterSprites");
} else if (!validationProps.successCriteria.allBananasChanged && !validationProps.successCriteria.someBananasChanged) {
  levelFailure(3, "bananaUnchanged");
} else if (!validationProps.successCriteria.allStrawberriesChanged && !validationProps.successCriteria.someStrawberriesChanged) {
  levelFailure(3, "strawberryUnchanged");
} else if (validationProps.successCriteria.someBananasChanged && !validationProps.successCriteria.allBananasChanged) {
  console.log("Only some bananas have changed size.");
  levelFailure(3, "bananaUnchanged"); // placeholder for now
} else if (validationProps.successCriteria.someStrawberriesChanged && !validationProps.successCriteria.allStrawberriesChanged) {
  console.log("Only some strawberries have changed size.");
  levelFailure(3, "strawberryUnchanged"); // placeholder for now
} else {
  levelFailure(0, "genericSuccess");
}
