import { useState, useEffect } from 'react';

export const useDatalist = (dataset) => {
  const [datalist, setDatalist] = useState({ artist: [], song: [], album: [] });

  useEffect(() => {
    const artistSet = new Set();
    const songSet = new Set();
    const albumSet = new Set();

    dataset.forEach(d => {
      artistSet.add(d.Artist);
      songSet.add(d.Song);
      albumSet.add(d.Album);
    });

    const ignoreCaseSort = (a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    };
    const artistList = Array.from(artistSet).sort(ignoreCaseSort);
    const songList = Array.from(songSet).sort(ignoreCaseSort);
    const albumList = Array.from(albumSet).sort(ignoreCaseSort);

    setDatalist({ artist: artistList, song: songList, album: albumList });
  }, [dataset]);

  return { datalist };
}