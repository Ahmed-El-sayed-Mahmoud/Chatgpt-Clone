const redis = require ('redis')

const client =redis.createClient({
    password: process.env.REDIS_CLIENT_KEY,
    socket: {
        host: 'redis-11479.c300.eu-central-1-1.ec2.redns.redis-cloud.com',
        port: 11479
    }
});
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
