var amqp = require('amqplib/callback_api');


amqp.connect('amqp://0.0.0.0', function (err, conn) {

    conn.createChannel(function (err, ch) {
        var ex = 'all_buses';

        ch.assertExchange(ex, 'fanout', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, '');

            ch.consume(q.queue, function (msg) {
                console.log(" [x] %s", msg.content.toString());
            }, { noAck: true });
        });
    });


})