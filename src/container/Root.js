import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStackNavigator, addListener } from 'react-navigation';
import HomeContainer from './Home';
import Chapters from "./Chapters"; //eslint-disable-line
import AudioPlayer from './AudioPlayer';

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

const AppWithNavigationState = ({ dispatch, navigation }) =>
  (<AppNavigator
    navigation={{
      dispatch,
      state: navigation,
      addListener
    }}
  />);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default connect(state => ({
  navigation: state.navigation
}))(AppWithNavigationState);
