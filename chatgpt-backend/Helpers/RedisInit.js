const redis = require('redis')

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
})
client.connect()
client.on('connect', () => {
  console.log('Client connected to redis')
})

client.on('ready', () => {
  console.log('connected to redis and ready')
})

client.on('error', (err) => {
  console.log(err.message)
})


module.exports = client