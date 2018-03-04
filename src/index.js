const Ajv = require('ajv')
window.ajv = new Ajv()
const Game = require('./game')
const Network = require('./network')

window.game = new Game()
window.network = new Network()

network.on('connect', (peer) => {
  peer.on('data', (data) => {
    switch (data.type) {
      case 'join':
        game.addPlayer(peer.id, {
          name: data.props.name,
          pos: data.props.pos,
          angle: data.props.angle
        })
        break
      case 'update':
        game.updatePlayer(peer.id, {
          name: data.props.name,
          pos: data.props.pos,
          angle: data.props.angle
        })
        break
      case 'shoot':
        
        break
    }
  })

  peer.send({
    type: 'join',
    props: {
      name: game.me.name, 
      pos: game.me.pos, 
      angle: game.me.angle
    }
  })
})

network.on('disconnect', (peer) => {

})

network.on('state', (peer) => {

})

game.on('start', ({ name, pos, angle }) => {
  console.log('Starting game')

  network.broadcast({
    type: 'join',
    props: { name, pos, angle }
  })
})

game.on('update', ({ name, pos, angle }) => {
  console.log('update', { name, pos, angle })

  network.broadcast({
    type: 'update',
    props: { name, pos, angle }
  })
})

network.connect()
game.start()
