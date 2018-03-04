const BasePlayer = require('./base-player')

class OnlinePlayer extends BasePlayer {
  constructor(id) {
    super(id)
    this.id = id
  }
}

module.exports = OnlinePlayer