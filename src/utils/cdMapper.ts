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

export function mapToRawCd(item: SearchItemType): RawCDInfo {
  return {
    id: Number(item.id),
    title: item.title,
    artist: item.artist,
    album_title: item.album_title,
    genres: item.genres,
    imageUrl: item.imageUrl,
    date: item.date,
    youtubeUrl: item.youtubeUrl ?? '',
    duration: item.duration ?? 0,
    type: 'CD',
  };
}
