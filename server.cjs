const path = require('path');

const f = require('fastify')({ logger: true });

f.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

f.get('/', async (request, reply) => {
  reply.sendFile('/piblic/index.html');
});
