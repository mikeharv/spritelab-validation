if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    fourSprites: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
    bonus: false
  };
}

// Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();

// Count Sprites
if (!validationProps.successCriteria.fourSprites) {
  validationProps.successCriteria.fourSprites = (spriteIds.length >= 4);
}

// Check sprite locations
if (validationProps.successCriteria.fourSprites) {
  for (var i = 0; i < spriteIds.length; i++) {
    if ((getProp({id: spriteIds[i]}, "x") < 200) && (getProp({id: spriteIds[i]}, "y") > 200)) {
      validationProps.successCriteria.topLeft = true;
    } else if ((getProp({id: spriteIds[i]}, "x") > 200) && (getProp({id: spriteIds[i]}, "y") > 200)) {
      validationProps.successCriteria.topRight = true;
    } else if ((getProp({id: spriteIds[i]}, "x") < 200) && (getProp({id: spriteIds[i]}, "y") < 200)) {
      validationProps.successCriteria.bottomLeft = true;
    } else if ((getProp({id: spriteIds[i]}, "x") > 200) && (getProp({id: spriteIds[i]}, "y") < 200)) {
      validationProps.successCriteria.bottomRight = true;
    }

    if (getProp({id: spriteIds[i]}, "scale") != 100) {
      validationProps.successCriteria.bonus = true;
    }
  }
}

// Check criteria and give failure feedback
if (!validationProps.successCriteria.fourSprites) {
  levelFailure(3, "moreSprites");
} else if (!validationProps.successCriteria.topLeft) {
  levelFailure(3, "topLeft");
} else if (!validationProps.successCriteria.topRight) {
  levelFailure(3, "topRight");
} else if (!validationProps.successCriteria.bottomLeft) {
  levelFailure(3, "bottomLeft");
} else if (!validationProps.successCriteria.bottomRight) {
  levelFailure(3, "bottomRight");
} else if (validationProps.successCriteria.bonus) {
  levelFailure(0, "genericBonusSuccess");
} else {
  levelFailure(0, "genericSuccess");
}
