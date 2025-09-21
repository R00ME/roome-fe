export function mapToPostCDInfo(raw: RawCDInfo): PostCDInfo {
  return {
    title: raw.title,
    artist: raw.artist,
    album: raw.album_title,     
    genres: raw.genres,
    coverUrl: raw.imageUrl,   
    youtubeUrl: raw.youtubeUrl,
    duration: raw.duration,
    releaseDate: raw.date,  
  };
}
