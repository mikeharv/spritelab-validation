//https://levelbuilder-studio.code.org/levels/27317/edit
var spriteIds = getSpriteIdsInUse();
for (var i = 0; i < spriteIds.length; i++) {
  if (getProp({id: spriteIds[i]}, "x") > 400) {
    levelSuccess(0);
  }
}
