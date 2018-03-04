const shortid = require('shortid')
const EventEmitter = require('events').EventEmitter

class LocalPlayer extends EventEmitter {
  constructor() {
    super()

    this._name = 'player_' + shortid.generate()
  }

  set name(v) { 
    this._name = v
    this.emit('update-name', v)
  }
  get name() { return this._name }
}

module.exports = LocalPlayer