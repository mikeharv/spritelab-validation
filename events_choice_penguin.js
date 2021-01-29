var spriteIds = getSpriteIdsInUse();
// Fail right away if they don't have any sprites
if (spriteIds.length < 1) {
  levelFailure(3, 'noSprites');
}

if (!validationProps.previous) {
  validationProps.previous = {}; // id => {x: 200, y: 200}
}
if (!validationProps.successCriteria) {
  validationProps.successCriteria = {
    keyDown: {up: false, down: false, right: false, left: false},
    keyWentDown: {up: false, down: false, right: false, left: false},
    anySpriteMoved: {up: false, down: false, right: false, left: false},
    anyKeyPress: false
  };
}

function getDirection(spriteId) {
  var previousLoc = validationProps.previous[i];
  var currentLoc = {
    x: getProp({id: spriteIds[i]}, 'x'),
    y: getProp({id: spriteIds[i]}, 'y')
  };
  if (!previousLoc) {
    return [];
  }
  var dirs = [];
  if (previousLoc.x > currentLoc.x) {
    dirs.push('left');
  }
  if (previousLoc.x < currentLoc.x) {
    dirs.push('right');
  }
  if (previousLoc.y < currentLoc.y) {
    dirs.push('up');
  }
  if (previousLoc.y > currentLoc.y) {
    dirs.push('down');
  }
  return dirs;
}

function getKeyWentDown() {
  return keyWentDown('up') || keyWentDown('down') || keyWentDown('left') || keyWentDown('right');
}

function getKeyDown() {
  return keyDown('up') || keyDown('down') || keyDown('left') || keyDown('right');
}

if (getKeyWentDown() || getKeyDown()) {
  validationProps.successCriteria.anyKeyPress = true;
}

var spritesThatMoved = [];
for (var i = 0; i < spriteIds.length; i++) {
  var dirs = getDirection(spriteIds[i]);
  var isKeyDown = getKeyDown();
  var isKeyWentDown = getKeyWentDown();
  for (var j = 0; j < dirs.length; j++) {
    var dir = dirs[j];
    // Keep track of any movement in any direction
    validationProps.successCriteria.anySpriteMoved[dir] = true;

    // Keep track of whether anything moves on a keyDown tick
    if (keyDown(dir)) {
      validationProps.successCriteria.keyDown[dir] = true;
    }
    // Keep track of whether anything moves on keyWentDown tick
    if (keyWentDown(dir)) {
      validationProps.successCriteria.keyWentDown[dir] = true;
    }
  }

  // Track the sprite's location for the next frame
  validationProps.previous[spriteIds[i]] = {
    x: getProp({id: spriteIds[i]}, 'x'),
    y: getProp({id: spriteIds[i]}, 'y')
  };
}

// Check if this is the first frame that meets the success criteria
if (!validationProps.successTime) {
  if (
    validationProps.successCriteria.keyDown.up &&
    validationProps.successCriteria.keyDown.down &&
    validationProps.successCriteria.keyDown.left &&
    validationProps.successCriteria.keyDown.right
  ) {
    validationProps.successTime = World.frameCount;
    console.log(validationProps.successTime);
  }
}

var failTime = 100;
if (!validationProps.successTime && World.frameCount > failTime) {
  if (!validationProps.successCriteria.anyKeyPress) {
    console.log('did not press a key');
    levelFailure(3, 'didntPressKey');
  }
  else if (!validationProps.successCriteria.anySpriteMoved.up) {
    console.log('did not move up');
    levelFailure(3, 'didntMoveUp');
  }
  else if (!validationProps.successCriteria.anySpriteMoved.down) {
    console.log('did not move down');
    levelFailure(3, 'didntMoveDown');
  }
  else if (!validationProps.successCriteria.anySpriteMoved.left) {
    console.log('did not move left');
    levelFailure(3, 'didntMoveLeft');
  }
  else if (!validationProps.successCriteria.anySpriteMoved.right) {
    console.log('did not move right');
    levelFailure(3, 'didntMoveRight');
  }
  else if (
    validationProps.successCriteria.keyWentDown.up &&
    !validationProps.successCriteria.keyDown.up
  ) {
    console.log('change up to while');
    levelFailure(3, 'whenToWhile');
  }
  else if (
    validationProps.successCriteria.keyWentDown.down &&
    !validationProps.successCriteria.keyDown.down
  ) {
    console.log('change down to while');
    levelFailure(3, 'whenToWhile');
  }
  else if (
    validationProps.successCriteria.keyWentDown.left &&
    !validationProps.successCriteria.keyDown.left
  ) {
    console.log('change left to while');
    levelFailure(3, 'whenToWhile');
  }
  else if (
    validationProps.successCriteria.keyWentDown.right &&
    !validationProps.successCriteria.keyDown.right
  ) {
    console.log('change right to while');
    levelFailure(3, 'whenToWhile');
  } else {
    console.log('keys dont match directions');
    levelFailure(3, 'debugEvents');
  }
}

var waitTime = 100;
if (World.frameCount - validationProps.successTime >= waitTime) {
  console.log('Generic success');
  levelFailure(0, 'genericSuccess');
}
