const PIXI = require('pixi.js')

const texture = PIXI.Texture.fromImage('assets/ship-2.svg')

class Ship extends PIXI.Sprite {
  constructor(id) {
    super(texture)

    this.anchor.set(.5,.5)

    this.width = 32
    this.height = 32

    this.id = id
  }

  update({pos, angle, color}) {
    this.x = pos ? pos.x : this.x
    this.y = pos ? pos.y : this.y
    this.angle = angle ? angle : this.angle
    this.tint = color ? color : this.tint
  }
}

module.exports = Ship