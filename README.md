# pure-hell

A concept for a multiplayer bullet hell game powered by WebRTC for speedy connections

Uses signalhub and webrtc-swarm for connecting peers

## Development

- `npm run dev` starts a dev server
- `npm run build` builds browserify bundle in `dist/`

Also dont forget to run `npm i` before you start

## Structure

- `canvas/` has all the rendering and input logic
- `game/` has all the core game logic
- `network/` has all the networking logic
- `util/` random functions that i use
- `index.js` main entry point

Logic is event based. All logic between modules should be decoupled and they should not know their implementation. This makes testing and future development easier.

## TODO

- Change peer data sending to buffers and smaller payloads
- Implement data validation