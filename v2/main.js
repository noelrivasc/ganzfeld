import { addControls, updatePosition } from "./ui.js";
import { initialize as initializeGanzfeld, addEventListener, load, togglePlay, toggleFullScreen, setSpeed, rewind, goToPosition } from "./ganzfeld.js";

const mockUiEventHandler = (eventName) => {
    return (payload) => {
        console.log("Triggered mock handler for event: " + eventName);
        if(payload !== null) {
            console.log(`Payload received: ${JSON.stringify(payload)}`);
        }
        return {};
    }
}

const sceneBaseUrl = './data/';
const loadScene = async (eventPayload) => {
    if(!eventPayload.value) {
        console.log('TODO: disable scene on empty selection.');
        return;
    }

    await load({
        imageUrl: sceneBaseUrl + eventPayload.value + '.png',
        configurationUrl: sceneBaseUrl + eventPayload.value
    })
}

initializeGanzfeld();
addControls('controls',
  {
    load: loadScene,
    toggleFullScreen,
    togglePlay,
    rewind,
    goToPosition,
    setSpeed,
  },
  [
    ['test', 'System test'],
    ['rainbow-1', 'Rainbow 1'],
    ['blue-green-1', 'Blue Green 1'],
  ]
);

addEventListener('updatePosition', updatePosition);
