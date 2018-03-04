const pixelRatio = 1
var size = [1024, 1024 / 2]
var ratio = size[0] / size[1]

const PIXI = require('pixi.js')
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

module.exports = function() {
  let app = new PIXI.Application({
    backgroundColor: 0x111111    
  })
  document.body.appendChild(app.view);

  function resize() {
    /*
    if (window.innerWidth / window.innerHeight >= ratio) {
      var w = window.innerHeight * ratio;
      var h = window.innerHeight;
    } else {
      var w = window.innerWidth;
      var h = window.innerWidth / ratio;
    }
    */
    app.renderer.resize(window.innerWidth, window.innerHeight)
    app.view.style.width = window.innerWidth + 'px';
    app.view.style.height = window.innerHeight + 'px';
  }
  window.onresize = function(event) {
    resize();
  };

  resize()

  return app
}