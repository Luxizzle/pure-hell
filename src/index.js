const Network = require('./network')

window.network = new Network()

network.connect()

network.on('state', (state) => {
  console.log('state', state)
})

console.log(network)