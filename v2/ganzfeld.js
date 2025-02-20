// *************************************************
// * MODULE CONSTANTS AND STATE*********************
// *************************************************
let play = false;
let previousStepTime;
let lastPosition = 0; // range from 0 to 100, float
let speedMultiplier = 1;

// Loaded show configuration
let referenceImageCanvas;
let referenceImagePixelData;
let timeConfiguration;

// Drawing to screen
let showCanvas;
let showCanvas2dContext;

// *************************************************
// * MODULE FUNCTIONS ******************************
// *************************************************
export const initialize = () => {
  referenceImageCanvas = document.createElement('canvas');
  showCanvas = document.createElement('canvas');
  showCanvas.height = 400; // TODO: fill screen
  showCanvas.width = 400;
  showCanvas2dContext = showCanvas.getContext('2d');
  document.getElementById('ganzfeld').appendChild(showCanvas);
}

export const load = async (payload) => {
  try {
    referenceImagePixelData = await loadImage(payload.imageUrl);
    timeConfiguration = await loadTimeConfiguration(payload.configurationUrl);
    validateConfiguration();
  } catch (error) {
    console.error(error.message);
  }
}

function validateConfiguration() {
  const expectedFrames = (referenceImagePixelData.length / 4 / 2) - 2;
  if (timeConfiguration.frames.length !== expectedFrames) {
    throw new Error(`Expected ${expectedFrames} but found ${timeConfiguration.frames.length} instead.`);
  }
}

async function loadTimeConfiguration(configurationFileUrl) {
  const response = await fetch(configurationFileUrl);
  const contents = await response.text();
  console.log(contents);
  const lines = contents.split('\n');

  // Take first line, split by space and populate duration and fragments
  let [duration, fragments] = lines.shift().split(' ');
  duration = parseInt(duration);
  fragments = parseInt(fragments);

  // Convert the rest of the lines to an array of numbers
  const frames = lines.map(line => parseInt(line))

  return {
    duration,
    fragments,
    frames,
  };
}

function loadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for CORS (if needed)

    img.onload = () => {
      const ctx = referenceImageCanvas.getContext('2d');
      referenceImageCanvas.width = img.width;
      referenceImageCanvas.height = img.height;
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      const pixelData = ctx.getImageData(0, 0, img.width, img.height).data;
      resolve(pixelData);
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}

function drawStep(position) {
  console.log(`Drawing step: ${position}`);
}

const step = (time) => {
  if (!play) return;

  const getNewPosition = () => {
    const timeElapsed = time - previousStepTime;
    const newPosition = lastPosition + (timeElapsed / timeConfiguration.duration * 100 * speedMultiplier);
    if (newPosition >= 100) {
      play = false;
      return 100;
    }
    return newPosition;
  }

  let newPosition = previousStepTime ? getNewPosition() : lastPosition;
  drawStep(newPosition);
  lastPosition = newPosition;

  previousStepTime = time;

  window.requestAnimationFrame(step);
}

export const togglePlay = () => {
  play = !play;
  if (play) {
    window.requestAnimationFrame(step);
  } else {
    previousStepTime = undefined;
  }
}