const functions = require("firebase-functions");
const request = require("request-promise");

exports.getAlbumInfo = functions.https.onCall((data, context) => {
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${functions.config().lastfm.key}&artist=${data.Artist}&album=${data.Album}&format=json`;
  return request({
    url: encodeURI(apiUrl),
  });
});

exports.getArtistTags = functions.https.onCall((artist, context) => {
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist}&api_key=${functions.config().lastfm.key}&format=json`;
  return request({
    url: encodeURI(apiUrl),
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

