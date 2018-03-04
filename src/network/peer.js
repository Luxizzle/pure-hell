const isJSON = require('../util/is-json')
const EventEmitter = require('events').EventEmitter
const truncate = require('cli-truncate')

const dataValidate = ajv.compile({
  type: 'object',
  properties: {
    type: { type: 'string' },
    props: { type: 'object' }
  },
  required: [ 'type' ]
})

class Peer extends EventEmitter {
  constructor(peer, id) {
    super()

    this.peer = peer
    this.id = id

    // The amount of peers that have disconnected from this peer
    this.disconnectVote = 0

    this._destroyed = false

    this.peer.on('data', this.onData.bind(this))
  }

  onData(data) {
    if (this._destroyed) return

    if (!isJSON(data)) return
    data = JSON.parse(data)

    const valid = dataValidate(data)
    if (!valid) return console.warn(truncate(this.id, 9, { position: 'middle' }), 'invalid data', ajv.errorsText(dataValidate.errors))

    console.log(truncate(this.id, 9, { position: 'middle' }), data)

    this.emit('data', data)
  }

  send(data) {
    if (this._destroyed) return
    this.peer.send(JSON.stringify(data))
  }

  destroy() {
    this._destroyed = true
    this.removeAllListeners()
    this.peer.destroy()
  }
}

module.exports = Peer