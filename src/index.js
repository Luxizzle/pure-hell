const Game = require('./game')
const Network = require('./network')

window.game = new Game()
window.network = new Network()

network.connect()

network.on('connect', (peer) => {
  peer.on('data', (data) => {
    switch (data.type) {
      case 'join':
        game.addPlayer(peer.id, {
          name: data.name,
          pos: data.pos,
          angle: data.angle
        })
        break
      case 'update':
        game.updatePlayer(peer.id, {
          name: data.name,
          pos: data.pos,
          angle: data.angle
        })
        break
      case 'shoot':
        
        break
    }
  })
})

network.on('disconnect', (peer) => {

})

network.on('state', (peer) => {

})

game.on('start', ({ name, pos, angle }) => {
  network.broadcast({
    type: 'join',
    name, pos, angle
  })
})

game.on('update', ({ name, pos, angle }) => {
  network.broadcast({
    type: 'update',
    name, pos, angle
  })
})

network.connect()
game.start()
