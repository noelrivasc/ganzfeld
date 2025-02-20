const uiMarkup = `
  <style>
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: black;
    }

    .controls__wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 25px;
      width: 100%;
      margin-bottom: -30px;
      transition: margin-bottom 0.25s;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .controls__wrapper.is-visible {
      margin-bottom: 50px;
    }

    .controls {
      display: flex;
      flex-wrap: nowrap;
      padding: 0 12.5vw;
    }

    .controls .controls__control-wrapper {
      flex-shrink: 1;
      margin-right: 6px;
    }
    
    .controls .controls__control-wrapper--grow {
      flex-grow: 1;
    }
    
    .controls .controls__control-wrapper--grow input[type=range] {
      width: 100%;
    }

    .controls .controls__control-wrapper.is-disabled {
      opacity: 0.5;
    }

    .controls__button {
      display: block;
      border: 1px solid rgba(0, 0, 0, 0.28);
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 0.75);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
      padding: 2px;
      margin: 0;
    }
    .controls__button svg {
      width: 18px;
      height: 18px;
      display: block;
    }
  </style>
  <div class="controls__wrapper is-visible">
    <div class="controls">
      <div class="controls__control-wrapper">
        <select class="controls__select" aria-label="Select show to load" name="load-show" data-action="load">
          <option value="">Load:</option>
          <option value="test">System test</option>
        </select>
      </div>
      <div class="controls__control-wrapper is-disabled">
        <button class="controls__button" aria-label="Toggle full screen" data-action="toggleFullScreen">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 9.99739C6.01447 8.29083 6.10921 7.35004 6.72963 6.72963C7.35004 6.10921 8.29083 6.01447 9.99739 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M6 14.0007C6.01447 15.7072 6.10921 16.648 6.72963 17.2684C7.35004 17.8888 8.29083 17.9836 9.99739 17.998" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M17.9976 9.99739C17.9831 8.29083 17.8883 7.35004 17.2679 6.72963C16.6475 6.10921 15.7067 6.01447 14.0002 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M17.9976 14.0007C17.9831 15.7072 17.8883 16.648 17.2679 17.2684C16.6475 17.8888 15.7067 17.9836 14.0002 17.998" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        </button>
      </div>
      <div class="controls__control-wrapper is-disabled">
        <button class="controls__button" aria-label="Play / pause" data-action="togglePlay">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46484 3.92349C4.79896 3.5739 4 4.05683 4 4.80888V19.1911C4 19.9432 4.79896 20.4261 5.46483 20.0765L19.1622 12.8854C19.8758 12.5108 19.8758 11.4892 19.1622 11.1146L5.46484 3.92349ZM2 4.80888C2 2.55271 4.3969 1.10395 6.39451 2.15269L20.0919 9.34382C22.2326 10.4677 22.2325 13.5324 20.0919 14.6562L6.3945 21.8473C4.39689 22.8961 2 21.4473 2 19.1911V4.80888Z" fill="#0F0F0F"></path> </g></svg>
        </button>
      </div>
      <div class="controls__control-wrapper is-disabled">
        <button class="controls__button" aria-label="Rewind" data-action="rewind">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 8.76844L19.0966 4.30838C20.3991 3.41122 21.9998 4.57895 21.9998 6.42632L21.9998 17.5737C21.9998 19.4211 20.3991 20.5888 19.0966 19.6916L13 15.2316" stroke="#1C274C" stroke-width="1.5"></path> <path d="M2.92136 10.1468C1.69288 10.9545 1.69288 13.0455 2.92135 13.8532L10.3388 18.7302C11.5327 19.5152 13 18.4934 13 16.877L13 7.12303C13 5.50658 11.5327 4.48482 10.3388 5.26983L2.92136 10.1468Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
        </button>
      </div>
      <div class="controls__control-wrapper controls__control-wrapper--grow is-disabled">
          <input type="range" class="controls__range" min="0" max="100" value="0" data-action="goToPosition">
      </div>
      <div class="controls__control-wrapper is-disabled">
        <select class="controls__select" aria-label="Playback Speed" name="playback-speed" data-action="setSpeed">
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
          <option value="10">10x</option>
          <option value="100">100x</option>
        </select>
      </div>
    </div>
  </div>
`;

export const addControls = (containerId, eventHandlers) => {
  const container = document.getElementById(containerId);
  container.innerHTML = uiMarkup;

  const buttons = container.getElementsByClassName("controls__button");

  const handleAction = (action, payload) => {
    if(eventHandlers[action]) {
      eventHandlers[action](payload);
    } else {
      console.warn(`Event handler not defined for button with action: ${action}`);
    }
  }

  Array.from(buttons).forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.currentTarget.dataset.action;
      handleAction(action, null);
    })
  })

  const ranges = container.getElementsByClassName("controls__range");

  Array.from(ranges).forEach((range) => {
    range.addEventListener("input", (event) => {
      const action = event.currentTarget.dataset.action;
      const value = event.target.value;
      handleAction(action, {value});
    })
  })

  const selects = container.getElementsByClassName("controls__select");

  Array.from(selects).forEach((range) => {
    range.addEventListener("change", (event) => {
      const action = event.currentTarget.dataset.action;
      const value = event.target.value;
      handleAction(action, {value});
    })
  })
}
