import * as PIXI from 'pixi.js';
import originalConfig from './g1.json';
import twentyWakeUp from './twentyWakeUp.json';

let quality = 256;
let canvas, app, ctx, gradient, sprite, texture, start, elapsed;
let ganzfeldConfig = twentyWakeUp;
let moments = Object.keys(ganzfeldConfig.steps).map((key) => {return Number(key);}).sort((a, b) => {a - b});

let framesElapsed;

// Creates a new canvas element
function setupCanvas() {
  canvas = document.createElement('canvas');
  // document.getElementById('ganzfeld').appendChild(canvas);
  canvas.height = quality;
  canvas.width = 20;

  return canvas;
}

function getColorStringFromRGB(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

function createGradient(canvas2dContext, stops) {
  const quality = 256;
  const grd = canvas2dContext.createLinearGradient(0, 0, 0, quality);

  // const stops = ganzfeldConfig.initialState;
  for(let stop of stops) {
    let color = stop.color;
    grd.addColorStop(stop.position, getColorStringFromRGB(...color));
  }

  return grd;
}

function getInterpolatedGradient(timestamp) {
  // Find the steps that surround the current moment

  let currentTransition = {};

  // If it's before the first declared moment, interpolate between
  // start and first
  if(timestamp < moments[0]) {
    currentTransition.startTime = 0;
    currentTransition.endTime = moments[0];

    currentTransition.start = ganzfeldConfig.initialState;
    currentTransition.end = ganzfeldConfig.steps[String(moments[0])];
  }
  
  // If it's after the last declared moment, interpolate between
  // that and the end state
  else if(timestamp > moments[moments.length-1]) {
    currentTransition.startTime = moments[moments.length-1];
    currentTransition.endTime = ganzfeldConfig.endTime;

    currentTransition.start = ganzfeldConfig.steps[String(moments[moments.length-1])];
    currentTransition.end = ganzfeldConfig.endState;
  }

  // If it's somewhere in between, find the two moments surrounding the current one
  // and interpolate based on those
  else {
    for(let i=0; i < moments.length; i++) {
      if(moments[i] <= timestamp && moments[i+1] > timestamp) {
        currentTransition.startTime = moments[i];
        currentTransition.endTime = moments[i+1];

        currentTransition.start = ganzfeldConfig.steps[String(moments[i])];
        currentTransition.end = ganzfeldConfig.steps[String(moments[i+1])];
      }
    }
  }

  // Get a sorted array of the gradient steps
  const sortedStart = currentTransition.start.sort((a, b) => {a.position - b.position});
  const sortedEnd = currentTransition.end.sort((a, b) => {a.position - b.position});
  
  const currentRangeSize = currentTransition.endTime - currentTransition.startTime;
  const positionInRange = timestamp - currentTransition.startTime;
  const position = positionInRange / currentRangeSize;

  const interpolateNumber = (position, start, end) => {
    const range = end - start;
    return start + (range * position);
  }

  // Interpolate their position and R, G and B values
  // to produce a new gradient array
  let resultingGradient = [];
  for(let i = 0; i < 5; i++) {
    // Position, r, g, b
    let newGradientStep = {
      position: interpolateNumber(position, sortedStart[i]['position'], sortedEnd[i]['position']),
      color: [
        interpolateNumber(position, sortedStart[i]['color'][0], sortedEnd[i]['color'][0]),
        interpolateNumber(position, sortedStart[i]['color'][1], sortedEnd[i]['color'][1]),
        interpolateNumber(position, sortedStart[i]['color'][2], sortedEnd[i]['color'][2])
      ]
    };

    resultingGradient.push(newGradientStep);
  }

  return createGradient(ctx, resultingGradient);
}

function step(timestamp) {
  const gradient = getInterpolatedGradient(timestamp);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 20, quality);
  texture.update();

  if(timestamp < ganzfeldConfig.endTime) {
    window.requestAnimationFrame(step);
  }
}

function toggleFullScreen() {
  let fsElement = document.getElementById('ganzfeld');
  if (!document.fullscreenElement) {
    fsElement.requestFullscreen();
    sprite.height = window.app.renderer.height;
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

window.onload = () => {
  const startTime = Date.now();
  const canvas = setupCanvas(ganzfeldConfig);
  // document.getElementById('ganzfeld').appendChild(canvas);
  ctx = canvas.getContext('2d');
  // gradient = createGradient(ctx, ganzfeldConfig.initialState);
  // ctx.fillStyle = gradient;
  // // TODO: move quality to a shared bind instead of hardcoding it
  // ctx.fillRect(0, 0, 20, quality);

  app = new PIXI.Application({
    antialias: true,
    resizeTo: document.body
  });
  window.app = app;

  document.getElementById('ganzfeld').appendChild(app.view);
  texture = PIXI.Texture.from(canvas);
  sprite = new PIXI.Sprite(texture);
  sprite.width = app.renderer.width;
  sprite.height = app.renderer.height;
  sprite.position.set(0, 0);
  app.stage.addChild(sprite);
  
  window.requestAnimationFrame(step);

  let fsButton = document.body.querySelector('#ui .full-screen');
  fsButton.addEventListener('click', () => {
    toggleFullScreen();
  });
}
