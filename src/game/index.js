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
    },
    color: { type: 'number' }
  }
})

class Game extends EventEmitter {
  constructor() {
    super()
    this.started = false

    this.players = []
  }

  addPlayer(id, data) {
    const valid = dataValidate(data)
    if (!valid) return console.warn(truncate(this.id, 9, { position: 'middle' }), 'invalid data', ajv.errorsText(dataValidate.errors))

    const player = new OnlinePlayer(id)
    player.update(data)

    player.on('update', (data) => {
      this.emit('update', id, data)
    })

    this.players.push(player)

    this.emit('add-player', id, data)
  }

  updatePlayer(id, data) {
    const valid = dataValidate(data)
    if (!valid) return console.warn(truncate(this.id, 9, { position: 'middle' }), 'invalid data', ajv.errorsText(dataValidate.errors))
    
    const player = this.players.find((player) => player.id === id)
    if (!player) return

    player.update(data)
  }

  removePlayer(id) {
    const playerIndex = this.players.findIndex((player) => player.id === id)
    if (playerIndex === -1) return

    this.players[playerIndex].removeAllListeners()

    this.players.slice(playerIndex, 1)

    this.emit('remove-player', id)
  }

  start(id) {
    if (this.started) return
    this.started = true

    this.me = new LocalPlayer(id)

    this.me.on('update', (data) => {
      this.emit('update', this.me.id, data)
    })

    this.emit('start', {
      name: this.me.name,
      pos: this.me.pos,
      angle: this.me.angle
    })

    this.emit('add-player', this.me.id, {
      name: this.me.name,
      pos: this.me.pos,
      angle: this.me.angle,
      color: this.me.color
    })
  }
}

module.exports = Game