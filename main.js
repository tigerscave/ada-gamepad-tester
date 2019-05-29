'use strict';

let vibrationActuator = null;
let gamePad = null;

const rAF =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame;

const buttonHandler = btns => {
  console.log(btns);
}

const axesHandler = axes => {
  console.log(axes);
}

const update = () => {
  const gamePadList = navigator.getGamepads();
  gamePad = gamePadList[0];  
  
  if(gamePad) {
    vibrationActuator = gamePad.vibrationActuator;
    buttonHandler(gamePad.buttons);
    axesHandler(gamePad.axes);
  }
  rAF(update);
}

rAF(update);

const onVibrationbuttonClicked = () => {
  if(gamePad) {
    vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: 500,
      weakMagnitude: 0.5,
      strongMagnitude: 0.5
    });
  } else {
    alert("no gamepad connected or press any button");
  }
}

const main = () => {
  document.getElementById('vibrationButton')
    .addEventListener('click', onVibrationbuttonClicked)
}

window.addEventListener("DOMContentLoaded", main);