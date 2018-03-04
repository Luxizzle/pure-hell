const pixelRatio = 1
var size = [1000, 1000]
var ratio = size[0] / size[1]

const PIXI = require('pixi.js')

module.exports = function() {
  var app = new PIXI.Application({
    width: size[0], height: size[1]
  })
  document.body.appendChild(app.view);

  function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
      var w = window.innerHeight * ratio;
      var h = window.innerHeight;
    } else {
      var w = window.innerWidth;
      var h = window.innerWidth / ratio;
    }
    app.view.style.width = w + 'px';
    app.view.style.height = h + 'px';
  }
  window.onresize = function(event) {
    resize();
  };

  resize()

  return app
}