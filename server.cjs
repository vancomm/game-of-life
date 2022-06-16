const fastify = require('fastify')();
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.get('/', (req, reply) => reply.sendFile('index.html'));
