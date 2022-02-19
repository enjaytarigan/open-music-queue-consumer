const { Pool } = require('pg/lib');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT s.id, s.title, s.performer
        FROM playlist_songs AS ps
        INNER JOIN songs AS s ON s.id = ps.song_id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongsService;
