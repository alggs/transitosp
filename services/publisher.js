const amqp = require('amqplib')
const CONSTANTS = require('../utils/constants')


class Publisher {
    constructor (exchangeKey) {
        this.exchangeKey = exchangeKey
    }

    async connect () {
        return await amqp.connect(`amqp://${CONSTANTS.RABBITMQ_HOST}`)
    }

    async createChannel (connection) {
        return await connection.createChannel().then((channel) => {
            channel.assertExchange(this.exchangeKey, 'fanout', { durable: false })
            return channel
        })
    }

    async sendMessage (channel, data) {
        channel.publish(this.exchangeKey, '', Buffer.from(data))
    }
}

module.exports = Publisher
