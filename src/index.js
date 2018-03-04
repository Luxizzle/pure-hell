const Ajv = require('ajv')
window.ajv = new Ajv()

const Game = require('./game')
const Network = require('./network')
const Canvas = require('./canvas')

window.game = new Game()
window.network = new Network()
window.canvas = new Canvas()

network.on('connect', (peer) => {
  peer.on('data', (data) => {
    switch (data.type) {
      case 'join':
        game.addPlayer(peer.id, data.props)
        break
      case 'update':
        game.updatePlayer(peer.id, data.props)
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
      angle: game.me.angle,
      color: game.me.color
    }
  })
})

network.on('disconnect', (peer) => {
  game.removePlayer(peer.id)
})

network.on('state', (peer) => {

})

game.on('start', ({ name, pos, angle }) => {
  console.log('Starting game')
/*
  network.broadcast({
    type: 'join',
    props: { name, pos, angle }
  })
*/
})
/*
game.on('update-me', (id, { name, pos, angle }) => {
  console.log('update', { name, pos, angle })

  network.broadcast({
    type: 'update',
    props: { name, pos, angle }
  })
})
*/

game.on('update', (id, data) => {
  canvas.updateShip(id, data)
})

game.on('add-player', (id, data) => {
  canvas.addShip(id, data)
})

game.on('remove-player', (id) => {
  canvas.removeShip(id)
})

canvas.on('tick', () => {
  network.broadcast({
    type: 'update',
    props: {
      name: game.me.name, 
      pos: game.me.pos, 
      angle: game.me.angle,
      color: game.me.color
    }
  })
})

network.connect(location.hash === '' ? 'default' : location.hash.slice(1))
game.start()

setInterval(() => {
  game.me.update({
    pos: {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }
  })
}, 250)