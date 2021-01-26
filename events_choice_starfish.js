//1. Must have == 1 sprites
var starterSprites = false;

//3. Must increase scale at some point
var increasedScale = validationProps.increasedScale;

//4. Must decrease Scale at some point
var decreasedScale = validationProps.decreasedScale;

//5. Must press key
var pressedKey=validationProps.pressedKey;

//Helper variables
var spriteIds = getSpriteIdsInUse();
var animations = getAnimationsInUse();


//Check for sprites
if(spriteIds.length >= 1){
  starterSprites=true;
}


//Check for Scale changes
var currentScale=getProp({id: spriteIds[0]}, "scale");
var currentScale=getProp({id: spriteIds[0]}, "scale");

if(currentScale>validationProps.scale){
  validationProps.increasedScale=true;
  //console.log("up");
} else if(currentScale<validationProps.scale){
  validationProps.decreasedScale=true;
  //console.log("down");
}
validationProps.scale=currentScale;
increasedScale = validationProps.increasedScale;
decreasedScale = validationProps.decreasedScale;
if(increasedScale&&decreasedScale&&!validationProps.successTime){
  validationProps.successTime=World.frameCount;
}

//Check for ever pressing key
if(!validationProps.pressedKey){
  validationProps.pressedKey= keyWentDown("up")||keyWentDown("down")||keyWentDown("left")||keyWentDown("right");
}
pressedKey=validationProps.pressedKey;

//Delay fail time (so student can observe the wrong animation)
var failTime=10;




// Check criteria and give failure feedback
if (World.frameCount > failTime) {
  if (!starterSprites) {
    console.log("It looks like you removed a remove sprite. You can add it back from the **Sprites** toolbox or reset your program using the Version History button below.");
    levelFailure(3, "starterSprites");
  } else {
    failTime=350;
    //Fail at failTime frames if we haven't succeeded
  if ((!decreasedScale||!increasedScale)&&World.frameCount > failTime) {

  if(!pressedKey){
    console.log("You didn't press a key");
    levelFailure(3, "didntPressKey");
  } else {
    console.log("Your sprite needs to spin both left and right.");
    levelFailure(3, "spinBothWays");
  }
}

  }
}


    push();
	var array=getBehaviorsForSpriteId(spriteIds[0]);
	textAlign(LEFT, TOP);
	textSize(20);
	noStroke();
	text("Current Behaviors:",10,25);
	for(var i=0;i<array.length;i++){
      text(array[i],10,50+i*25);
	}
	pop();
 




//Pass 100 frames after success
var waitTime=200;
if (World.frameCount-validationProps.successTime >= waitTime) {
    console.log("Generic success");
    levelFailure(0, "genericSuccess");
  }



//special timer for this level
push();


if(!decreasedScale||!increasedScale){
  fill(rgb(118,102,160));
  rect(0,390,(World.frameCount*400/failTime),10);
} else if (!decreasedScale||!increasedScale){
  fill(rgb(118,102,160));
  rect(0,390,((World.seconds*400/10)+1),10);
} else {
   fill(rgb(0,173,188));
  rect(0,390,((World.frameCount-validationProps.successTime)*400/waitTime),10);
}
pop();
