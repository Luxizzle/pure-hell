const Signalhub = require('signalhub')
const Swarm = require('webrtc-swarm')
const EventEmitter = require('events').EventEmitter
const Peer = require('./peer')

const NETWORK_STATES = {
  'CLOSED': 'CLOSED',
  'CONNECTING': 'CONNECTING',
  'CONNECTED': 'CONNECTED'
}

const DEFAULT_HUBS = ['https://signalhub-wtidrgzokn.now.sh']//, 'http://localhost:9988']

/*
Network class takes care of main communication between you and peers.

Also takes care of properly disconnecting and connecting.
Idea is that peers tell each other their connected peers so that game can be paused whenever someone connects to the network. This might be annoying, but its one of the downsides that WebRTC brings.
*/

class Network extends EventEmitter {
  constructor() {
    super()

    if (!Swarm.WEBRTC_SUPPORT) throw new Error('No WebRTC support, try a different browser.')

    this._state = NETWORK_STATES.CLOSED

    this.channel = 'default'
    this.hub = null // The main signal hub
    this.swarm = null // The WebRTC swarm
    this.heartbeat = null
    this.peers = []

    window.addEventListener('beforeunload', this.close.bind(this)) // properly disconnect on close
  }

  get state() { return this._state }
  set state(v) { 
    if (v === this._state) return 

    this._state = v 
    this.emit('state', this._state)
  }

  sendHearbeat() {
    this.broadcast({
      type: 'swarm',
      props: { peers: this.peers.map((peer) => peer.id) }
    })
  }

  // broadcast to all peers
  broadcast(data) {
    this.peers.forEach((peer) => {
      peer.send(data)
    })
  }

  send(id, data) {
    const peer = this.peers.find((peer) => peer.id === id)
    if (peer) {
      peer.send(data)
    } else {
      throw new Error('No peer with id ' + id)
    }
  }

  checkSwarm(peers) { 
    // idk i send all the peer ids, maybe for future i guess
    // this could also be exploitable and freeze clients forever so eh
    // we should really take the state with a grain of salt since there is no way to prove peer validity at this point
    if (peers.length === this.peers.legnth) {
      this.state = NETWORK_STATES.CONNECTED
    } else {
      this.state = NETWORK_STATES.CONNECTING
    }
  }

  /**
   * Connect to a channel
   * 
   * @param {String} channel 
   */
  connect(channel = 'default', hubs = DEFAULT_HUBS) {
    if (this.state !== NETWORK_STATES.CLOSED) this.close()
    this.state = NETWORK_STATES.CONNECTING
    this.channel = channel

    this.heartbeat = setInterval(this.sendHearbeat.bind(this), 60 * 1000)

    this.hub = Signalhub(channel, hubs)
    this.swarm = Swarm(this.hub)

    this.swarm.on('connect', (simplePeer, id) => {
      console.log('Connected to', id)
      const peer = new Peer(simplePeer, id)
      this.peers.push(peer)

      peer.on('data', (data) => {
        switch(data.type) {
          case 'swarm':
            this.checkSwarm(data.props.peers)
            break
          case 'disconnect-me': // The peer announces that its going to disconnect
            peer.destroy()
            break
          case 'disconnect': // A peer announces that it disconnected from another peer
            const disPeer = this.peers.find((peer) => data.props.id === peer.id)
            if (disPeer) {
              disPeer.disconnectVote += 1

              if (disPeer.disconnectVote >= this.peers.length / 2) { // if half of the peers have disconnected
                disPeer.destroy()
              }
            }
            break
        }
      })

      peer.send({
        type: 'swarm',
        props: { peers: this.peers.map((peer) => peer.id) }
      })

      this.emit('connect', peer)
    })

    this.swarm.on('disconnect', (simplePeer, id) => {
      const index = this.peers.findIndex((p) => p.id === id)
      if (index === -1) return

      console.log('Disconnected from', id, index)
      
      this.broadcast({
        type: 'disconnect',
        props: { id }
      })

      this.emit('disconnect', this.peers[index])
      
      this.peers.splice(index, 1)
    })
  }

  /** 
   * Close active connection
   */
  close() {
    if (this.state === NETWORK_STATES.CLOSED)

    clearInterval(this.heartbeat)
    this.swarm.close()
    this.hub.close()

    this.broadcast({
      type: 'disconnect-me'
    })

    this.peers.forEach((peer) => peer.destroy())

    this.swarm = null
    this.hub = null
    this.peers = []
  }
}

module.exports = Network
module.exports.NETWORK_STATES = NETWORK_STATES