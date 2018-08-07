import { AsyncStorage } from 'react-native';

function withLeadingZero(amount) {
  if (amount < 10) {
    return `0${amount}`;
  }
  return `${amount}`;
}

export function formattedTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = (timeInSeconds - minutes) * 60;

  if (isNaN(minutes) || isNaN(seconds) || (minutes < 0 && seconds < 0)) {
    return '';
  }
  return (`${withLeadingZero(minutes)}:${withLeadingZero(seconds.toFixed(0))}`);
}

export function findSongInCollection(id, songs) {
  return songs.filter(song => song.id === id).length;
}

export function isAudioObject(contentType) {
  return contentType === 'audio/mpeg';
}

export function getSongName(contentDescription) {
  return contentDescription.split('=')[1].replace(/"/g, '').split('.mp3')[0];
}


export async function getSongsFromStorage() {
  let songs = await AsyncStorage.getItem('songs');
  songs = songs || JSON.stringify([]);
  return JSON.parse(songs);
}

export function secondTime(seconds) {
  if (!seconds) return false;
  const date = new Date(null);
  date.setSeconds(seconds); // specify value for SECONDS here
  const time = date.toISOString().substr(11, 8);
  const splitTime = time.split(':');
  if (splitTime[0] === '00') {
    splitTime.shift();
    return splitTime.join(':');
  }
  return time;
}

export const constants = {
  defaultTime: '00:00'
};

export const itemsToTracks = items => items.map(item => ({
  id: item.id,
  url: item.path,
  title: item.title,
  artist: item.artist || '',
  artwork: encodeURI(item.thumb),
  pitchAlgorithm: 'voice'
}));

