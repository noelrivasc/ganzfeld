import { addControls } from "./ui.js";
import { initialize as initializeGanzfeld, load, togglePlay } from "./ganzfeld.js";

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
addControls('controls', {
    load: loadScene,
    toggleFullScreen: mockUiEventHandler('toggleFullScreen'),
    togglePlay,
    rewind: mockUiEventHandler('rewind'),
    goToPosition: mockUiEventHandler('goToPosition'),
    setSpeed: mockUiEventHandler('setSpeed'),
});
