import { combineReducers } from 'redux';
// import navigation from './navigation';
import { createNavigationReducer } from 'react-navigation-redux-helpers';

import main from './main';
import reciters from './reciters';
import chapters from './chapters';
import search from './search';
import player from './MusicPlayer';
import files from './files';


export default AppNavigator => combineReducers({
  main,
  reciters,
  chapters,
  search,
  songs: player,
  player,
  files,
  navigation: createNavigationReducer(AppNavigator)
});
