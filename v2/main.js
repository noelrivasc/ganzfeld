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

const showBaseUrl = './data/';
const loadShow = async (eventPayload) => {
    if(!eventPayload.value) {
        console.log('TODO: disable show on empty selection.');
        return;
    }

    await load({
        imageUrl: showBaseUrl + eventPayload.value + '.png',
        configurationUrl: showBaseUrl + eventPayload.value
    })
}

initializeGanzfeld();
addControls('controls', {
    load: loadShow,
    toggleFullScreen: mockUiEventHandler('toggleFullScreen'),
    togglePlay,
    rewind: mockUiEventHandler('rewind'),
    goToPosition: mockUiEventHandler('goToPosition'),
    setSpeed: mockUiEventHandler('setSpeed'),
});
