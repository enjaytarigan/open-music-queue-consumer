class Listener {
  constructor(playlistsService, playlistSongsService, mailService) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._mailService = mailService;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(
        message.content.toString()
      );
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistSongsService.getSongsByPlaylistId(
        playlistId
      );
      const content = JSON.stringify({
        playlist: {
          ...playlist,
          songs,
        },
      });
      const result = await this._mailService.sendEmail(targetEmail, content);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
