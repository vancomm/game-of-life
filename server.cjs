/* eslint-disable global-require */
const path = require('path');

module.exports = async function start(fastify, opts) {
  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  });
  fastify.get('/', (req, reply) => reply.sendFile('/public/index.html'));
  try {
    await fastify.listen({ port: '3000' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
