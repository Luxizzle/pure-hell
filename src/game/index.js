const _ = require('lodash')
const EventEmitter = require('events').EventEmitter

const LocalPlayer = require('./local-player')
const OnlinePlayer = require('./online-player')

class Game extends EventEmitter {
  constructor() {
    super()
    this.started = false
    this.app = require('./canvas')()
  }

  addPlayer(id, { name, pos, angle }) {
    if (!name || !pos || !angle) return 
    if (pos && (!pos.x || !pos.y)) return // invalid join data

    const player = new OnlinePlayer(id)
    player.update({ name, pos, angle })

    this.players.push(player)
  }

  updatePlayer(id, { name, pos, angle }) {
    
  }

  start() {
    if (this.started) return
    this.started = true

    this.players = []
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