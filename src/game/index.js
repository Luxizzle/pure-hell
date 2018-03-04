const _ = require('lodash')
const EventEmitter = require('events').EventEmitter

const LocalPlayer = require('./local-player')
const OnlinePlayer = require('./online-player')

dataValidate = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    angle: { type: 'number' },
    pos: { 
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' }
      },
      required: [ 'x', 'y' ]
    }
  }
})

class Game extends EventEmitter {
  constructor() {
    super()
    this.started = false
    this.app = require('./canvas')()

    this.players = []
  }

  addPlayer(id, data) {
    const valid = dataValidate(data)
    if (!valid) return console.warn(truncate(this.id, 9, { position: 'middle' }), 'invalid data', ajv.errorsText(dataValidate.errors))
    const { name, pos, angle } = data

    const player = new OnlinePlayer(id)
    player.update({ name, pos, angle })

    this.players.push(player)
  }

  updatePlayer(id, data) {
    const valid = dataValidate(data)
    if (!valid) return console.warn(truncate(this.id, 9, { position: 'middle' }), 'invalid data', ajv.errorsText(dataValidate.errors))
    const { name, pos, angle } = data
    
    const player = this.players.find((player) => player.id === id)
    if (!player) return

    player.update({ name, pos, angle })
  }

  start() {
    if (this.started) return
    this.started = true

    this.me = new LocalPlayer()

    this.me.on('update', ({ name, pos, ange }) => {
      this.emit('update', { name, pos, angle })
    })

    this.emit('start', {
      name: this.me.name,
      pos: this.me.pos,
      angle: this.me.angle
    })
  }
}

module.exports = Game