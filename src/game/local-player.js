const shortid = require('shortid')
const BasePlayer = require('./base-player')

class LocalPlayer extends BasePlayer {
  constructor(id) {
    super(id)

    this._name = 'player_' + shortid.generate()
  }
}

module.exports = LocalPlayer