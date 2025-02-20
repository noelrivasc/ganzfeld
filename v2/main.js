import { addControls } from "./ui.js";

const mockUiEventHandler = (eventName) => {
    return (payload) => {
        console.log("Triggered mock handler for event: " + eventName);
        if(payload !== null) {
            console.log(`Payload received: ${JSON.stringify(payload)}`);
        }
        return {};
    }
}

addControls('controls', {
    load: mockUiEventHandler('load'),
    toggleFullScreen: mockUiEventHandler('toggleFullScreen'),
    togglePlay: mockUiEventHandler('togglePlay'),
    rewind: mockUiEventHandler('rewind'),
    goToPosition: mockUiEventHandler('goToPosition'),
    setSpeed: mockUiEventHandler('setSpeed'),
});
