require('dotenv').config();
const amqp = require('amqplib');
const Listener = require('./listener');
const MailService = require('./services/nodemailer/MailService');
const PlaylistSongsService = require('./services/postgre/PlaylistSongsService');
const PlaylistsService = require('./services/postgre/PlaylistsService');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService();
  const mailService = new MailService();
  const listener = new Listener(
    playlistsService,
    playlistSongsService,
    mailService
  );
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', { durable: true });
  await channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
