//1. Must have == 1 sprites
var starterSprites = false;

//2. User must press an arrow key
var pressedKey = false;

//3. (Twice) One sprite must have changed properties after pressing run when key is pressed.
var propertiesChangedOnce = validationProps.change;
var propertiesChangedTwice = validationProps.change2;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();
var keyPressedNow = keyWentDown("up")||keyWentDown("down")||keyWentDown("left")||keyWentDown("right");
//if(keyPressedNow){console.log("now");}
var failTime=300;

//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}

//Check for ever pressing key
if(!validationProps.pressedKey){
  validationProps.pressedKey= keyPressedNow;
}
pressedKey=validationProps.pressedKey;

//Store initial props
if(!validationProps.x){
  validationProps.x=getProp({id: spriteIds[0]}, "x");
  validationProps.y=getProp({id: spriteIds[0]}, "y");
  validationProps.scale=getProp({id: spriteIds[0]}, "scale");
  validationProps.rotation=getProp({id: spriteIds[0]}, "rotation");
}

//check for change
if(validationProps.x!=getProp({id: spriteIds[0]}, "x")||
  validationProps.y!=getProp({id: spriteIds[0]}, "y")||
  validationProps.scale!=getProp({id: spriteIds[0]}, "scale")||
  validationProps.rotation!=getProp({id: spriteIds[0]}, "rotation")){
  if(keyPressedNow){
    if(propertiesChangedOnce){
      propertiesChangedTwice=true;
      validationProps.x=false;
      //console.log("second");
      validationProps.successTime=World.frameCount;
      validationProps.change2=true;
    } else {
      validationProps.change=true;
  	  propertiesChangedOnce=true;
  	  validationProps.x=false;
      //console.log("first");
    } 
  } else {
    validationProps.x=getProp({id: spriteIds[0]}, "x");
    validationProps.y=getProp({id: spriteIds[0]}, "y");
    validationProps.scale=getProp({id: spriteIds[0]}, "scale");
    validationProps.rotation=getProp({id: spriteIds[0]}, "rotation");
  }
}
    



  // Check criteria and give failure feedback
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } 




//Fail at 10 seconds if we haven't succeeded
if (!propertiesChangedOnce && World.frameCount > failTime) {
  if(pressedKey){
    console.log("Your properties never changed. ");
    levelFailure(3, "debugProps");
  } else {
    console.log("Your didn't press a key. ");
    levelFailure(3,"didntPressKey");
  }
} else if (!propertiesChangedTwice && World.frameCount > failTime) {
  console.log("Your properties only changed once. ");
  levelFailure(3, "debugProps");
}


//Pass 100 frames after success
var waitTime=100;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Explore success");
    levelFailure(0, "genericExplore");
  }



//special timer for this level
push();
/*
push();
var timerX=30;
var timerY=360;

  noStroke();
  fill("white");
  ellipse(timerX,timerY,32,32);
  stroke("white");
  strokeWeight(7);
  line(timerX,timerY-22,timerX,timerY-10);
  stroke("black");
  strokeWeight(3);
  line(timerX,timerY-20,timerX,timerY-10);
  ellipse(timerX, timerY, 25, 25);
  fill("black");
  noStroke();
  arc(timerX,timerY,18,18,45,270);
  stroke("white");
  textAlign(CENTER, TOP);
  strokeWeight(5);
  textSize(20);
  text(World.seconds,timerX+30,timerY);
pop();
*/
if(!validationProps.change2){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
