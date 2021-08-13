// import {setContrastingColors} from './colors.js';

// /**
//  * Gets and displays the tags of the given song's artist
//  * @param {Object} song The song to retrieve the tags for
//  */
// export function displayTags(song) {
//   const getArtistTags = firebase.functions().httpsCallable('getArtistTags');
//   getArtistTags(song).then(result => {
//     const tags = JSON.parse(result.data);

//     let divTags = document.getElementById('tagList');
//     divTags.innerHTML = '';

//     let apiTags = tags.toptags.tag;
//     let topFiveTags = apiTags.slice(0, 5);
//     for (let i = 0; i < topFiveTags.length; i++) {
//       let spanElement = document.createElement('span');
//       spanElement.className = 'tag';
//       spanElement.innerText = topFiveTags[i].name;
//       divTags.appendChild(spanElement);
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });
// }

// /**
//  * Displays the selected song's info
//  * @param {Object} song The song to display the info of
//  */
// export function displaySongInfo(song) {
//   const songInfo = document.getElementById('song-info');
//   songInfo.style.display = 'block';

//   let imgAlbumArt = document.getElementById('album-art');
//   let divArtist = document.getElementsByClassName('artist');
//   let divSong = document.getElementsByClassName('song');
//   let divAlbum = document.getElementsByClassName('album');
//   let divDate = document.getElementsByClassName('date');

//   divArtist[0].innerText = song.Artist;
//   divSong[0].innerText = song.SongTitle;
//   divAlbum[0].innerText = song.Album;
//   divDate[0].innerText = song.Day + ' ' + song.ConvertedDateTime;

//   let albumArt = '';
//   const getAlbumInfo = firebase.functions().httpsCallable('getAlbumInfo');
//   getAlbumInfo(song).then(result => {
//     const albumInfo = JSON.parse(result.data);
//     let albumArt = albumInfo.album.image[2]['#text'];
//     if (albumArt === '') {
//       albumArt = 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png';
//     }
//     imgAlbumArt.src = albumArt;

//     setContrastingColors(albumArt);
//   })
//     .catch(error => {
//       albumArt = 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png';
//       imgAlbumArt.src = albumArt;
//       setContrastingColors(albumArt);
//       console.log(error);
//     });
// }