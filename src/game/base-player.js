
const EventEmitter = require('events').EventEmitter

class BasePlayer extends EventEmitter {
  constructor(id) {
    super()
    this.id = id

    this._name = 'no_name'
    this._angle = 0
    this._pos_x = 500
    this._pos_y = 500 
  }

  set name(v) {
    this._name = v
    this.emit('update', { name: v })
  }
  get name() { return this._name }

  set angle(v) {
    this._angle = v
  }
  get angle() { return this._angle }

  set pos({ x, y }) {
    this._pos_x = x
    this._pos_y = y
  }
  get pos() { return { x: this._pos_x, y: this._pos_y }}

  update({ name, pos, angle }) {
    this.name = name || this.name
    this.pos = pos || this.pos
    this.angle = angle || this.angle
  }
}

module.exports = BasePlayer