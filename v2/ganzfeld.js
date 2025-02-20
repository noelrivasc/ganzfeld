// *************************************************
// * MODULE CONSTANTS AND STATE*********************
// *************************************************
let play = false;
let currentPosition = 0; // range from 0 to 100, float
let referenceImage;
let imageCanvas;
let imagePixelData;

let timeConfiguration;

// *************************************************
// * MODULE FUNCTIONS ******************************
// *************************************************
export const initialize = () => {
  imageCanvas = document.createElement('canvas');
}

export const load = async (payload) => {
  try {
    imagePixelData = await loadImage(payload.imageUrl);
    timeConfiguration = await loadTimeConfiguration(payload.configurationUrl);
    validateConfiguration();
  } catch (error) {
    console.error(error.message);
  }
}

function validateConfiguration() {
  const expectedFrames = (imagePixelData.length / 4 / 2) - 2;
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
      const ctx = imageCanvas.getContext('2d');
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pixelData = ctx.getImageData(0, 0, img.width, img.height).data;
      resolve(pixelData);
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}

const step = (time) => {
  if (!play) return;

  // TODO: do something!

  window.requestAnimationFrame(step);
}

export const togglePlay = () => {
  play = !play;
  if (play) {
    window.requestAnimationFrame(step);
  }
}