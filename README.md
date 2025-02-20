# GANZFELD

A series of experiments to make a full-screen color immersive show with the monitor. Just color transitions, really.

## V1

- Laravel Mix for building
- Uses canvas to draw a gradient, then PIXI to copy the gradient to a texture, and use the texture to fill the screen.
- Lots of logic at each step
- Consumes JSONs that are not easy to produce
- Playback is clunky, requires script editing to change the piece played

## V2 - Better UI & simpler show creation

There are three goals to this version:

- To make the code simpler (get rid of PIXI)
- To provide UI for show control: play/pause, rewind, scrubber, speed control and full screen
- To keep the UI out of the way (make it float, perhaps show only on mouse move)
- Load shows from an image + text file pair, rather than JSON
