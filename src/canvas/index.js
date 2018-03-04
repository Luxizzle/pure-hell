const EventEmitter = require('events').EventEmitter
const PIXI = require('pixi.js')
const Ship = require('./ship')

class Canvas extends EventEmitter {
  constructor() {
    super()

    this.app = require('./app')()

    this.ships = []
    this.bullets = []
    this.player = null

    this.container = new PIXI.Container()
    this.app.stage.addChild(this.container)

    this.app.ticker.add(this.onTick.bind(this))
  }

  onTick(delta) {
    this.emit('tick')
  }

  addShip(id, data) {
    const ship = new Ship(id)

    this.container.addChild(ship)

    this.ships.push(ship)

    ship.update(data)
  }

  updateShip(id, data) {
    const ship = this.ships.find((ship) => id === ship.id)
    if (!ship) return

    ship.update(data)
  }

  removeShip(id) {
    const shipIndex = this.ships.findIndex((ship) => id === ship.id)
    if (shipIndex === -1) return

    this.ships[shipIndex].removeAllListeners()
    this.ships[shipIndex].destroy()

    this.ships.splice(shipIndex, 1)
  }
}

module.exports = Canvas