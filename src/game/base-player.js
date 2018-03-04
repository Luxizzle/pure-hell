const truncate = require('cli-truncate')
const EventEmitter = require('events').EventEmitter

class BasePlayer extends EventEmitter {
  constructor(id) {
    super()
    this.id = id

    this._name = 'no_name'
    this._angle = 0
    this._pos_x = Math.random() * 1024
    this._pos_y = Math.random() * 1024
    this._color = Math.floor(Math.random() * 0xFFFFFF)
  }

  set name(v) {
    this._name = v
    this.emit('update', { name: v })
  }
  get name() { return this._name }

  set angle(v) {
    this._angle = v
    this.emit('update', { angle: v })
  }
  get angle() { return this._angle }

  set pos({ x, y }) {
    this._pos_x = x
    this._pos_y = y

    this.emit('update', { pos: this.pos })
  }
  get pos() { return { x: this._pos_x, y: this._pos_y }}

  get color() { return this._color }
  set color(v) {
    this._color = v
    this.emit('update', { color: this._color })
  }

  update({ name, pos, angle }) {
    this.name = name || this.name
    this.pos = pos || this.pos
    this.angle = angle || this.angle
  }
}

module.exports = BasePlayer