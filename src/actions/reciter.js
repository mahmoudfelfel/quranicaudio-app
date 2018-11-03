import { FETCH_RECITERS } from './constants';
import { cleanTextHTML } from '../utils';

const cleanDescriptionHTML = (data) => {
  return data.map(obj => ({
    ...obj,
    description: cleanTextHTML(obj.description)
  }));
};

export const reciters = data => ({
  type: FETCH_RECITERS,
  data
});

export const getReciters = () => {
  const url = 'https://quranicaudio.com/api/qaris';

  return dispatch => fetch(url)
    .then(response => response.json())
    .then(data => dispatch(reciters(cleanDescriptionHTML(data))))
    .catch((error) => {
      console.warn(error);
      dispatch(reciters([]));
    });
};
