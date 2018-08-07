import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { StatusBar, View } from 'react-native';
// import { AppNavigator } from './container/Root';
import reducers from './reducers';
import { createStackNavigator } from 'react-navigation';
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers';
import AudioPlayer from './container/AudioPlayer.js';
import HomeContainer from './container/Home';
import Chapters from "./container/Chapters"; //eslint-disable-line

export const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeContainer },
    Chapters: { screen: Chapters },
    AudioPlayer: { screen: AudioPlayer }
  },
  {
    mode: 'card',
    headerMode: 'screen'
  }
);

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation,
);

const store = createStore(
  reducers(AppNavigator),
  compose(applyMiddleware(thunk, navigationMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop) //eslint-disable-line
);
// const store = createStoreWithMiddleware(reducers(AppNavigator));
const mapStateToProps = state => ({
  state: state.navigation,
});

console.log("AppNavigator", AppNavigator);

const App = reduxifyNavigator(AppNavigator, 'root');
const AppWithNavigationState = connect(mapStateToProps)(App);

const Main = () => (
  <Provider store={store}>
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent />
      <AppWithNavigationState />
      <AudioPlayer />
    </View>
  </Provider>
);

export default Main;
