// *************************************************
// * MODULE CONSTANTS AND STATE*********************
// *************************************************
let play = false;
let previousStepTime;
let lastPosition = 0; // range from 0 to 100, float
let speedMultiplier = 1;

// Loaded scene configuration
let referenceImageCanvas;
let referenceImagePixelData;
let timeConfiguration;

// Drawing to screen
let sceneCanvas;
let sceneCanvas2dContext;

// *************************************************
// * MODULE FUNCTIONS ******************************
// *************************************************
export const initialize = () => {
  referenceImageCanvas = document.createElement('canvas');
  sceneCanvas = document.createElement('canvas');
  sceneCanvas.height = window.innerHeight;
  sceneCanvas.width = window.innerWidth;
  sceneCanvas2dContext = sceneCanvas.getContext('2d');
  document.getElementById('ganzfeld').appendChild(sceneCanvas);
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

  // The first line of the file defines the duration
  // of the scene, in milliseconds.
  const duration = parseInt(lines.shift());

  // The rest of the lines define the positions of the
  // frames in time, in a range from 0 to 100
  const frames = lines.map(line => parseFloat(line))

  return {
    duration,
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

/**
 * Does the interpolation for the current position
 * and draws the gradient on the scene canvas
 * @param position Number, a value in the range 0-100
 */
function drawStep(position) {
  const { fromPosition, toPosition, fromIndex, toIndex } = getFromAndToFrames(timeConfiguration.frames, position);
  const positionWithinFrames = (position - fromPosition) / (toPosition - fromPosition);
  const fromTopColor = getColorAtOffset(referenceImagePixelData, fromIndex * 4);
  const toTopColor = getColorAtOffset(referenceImagePixelData, toIndex * 4);
  const fromBottomColor = getColorAtOffset(referenceImagePixelData, (fromIndex * 4) + (referenceImageCanvas.width * 4));
  const toBottomColor = getColorAtOffset(referenceImagePixelData, (toIndex * 4) + (referenceImageCanvas.width * 4));

  const topColor = interpolateColor(fromTopColor, toTopColor, positionWithinFrames);
  const bottomColor = interpolateColor(fromBottomColor, toBottomColor, positionWithinFrames);

  const gradient = sceneCanvas2dContext.createLinearGradient(0, 0, 0, sceneCanvas.height);
  gradient.addColorStop(0, `rgb(${topColor.r}, ${topColor.g}, ${topColor.b}, ${topColor.a})`);
  gradient.addColorStop(1, `rgb(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b}, ${bottomColor.a})`);

  sceneCanvas2dContext.fillStyle = gradient;
  sceneCanvas2dContext.fillRect(0, 0, sceneCanvas.width, sceneCanvas.height);
}

function interpolateColor(color1, color2, position) {
  return {
    r: color1.r + ((color2.r - color1.r) * position),
    g: color1.g + ((color2.g - color1.g) * position),
    b: color1.b + ((color2.b - color1.b) * position),
    a: color1.a + ((color2.a - color1.a) * position),
  }
}

/**
 * @param imageData an ImageData array which has the pixels in the reference image
 * @param offset The offset in the array from which the color is obtained
 */
function getColorAtOffset(imageData, offset) {
  return {
    r: imageData[offset],
    g: imageData[offset + 1],
    b: imageData[offset + 2],
    a: imageData[offset + 3],
  }
}

function getFromAndToFrames(configurationFrames, position) {
  let previousFrame;
  let frameIndex = 1; // the initial  frame is implicit
  let frames = {};

  configurationFrames.forEach((frame) => {
    if (previousFrame === undefined && position <= frame) {
      frames.fromPosition = 0;
      frames.toPosition = frame;
      frames.fromIndex = 0;
      frames.toIndex = frameIndex;
    } else if (position > previousFrame &&  position < frame) {
      frames.fromPosition = previousFrame;
      frames.toPosition = frame;
      frames.fromIndex = frameIndex - 1;
      frames.toIndex = frameIndex;
    } else if (position > frame) {
      frames.fromPosition = frame;
      frames.toPosition = 100;
      frames.fromIndex = frameIndex;
      frames.toIndex = frameIndex + 1;
    }

    previousFrame = frame;
    frameIndex++;
  });
  return frames;
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