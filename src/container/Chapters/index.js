import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/index';
import { Container } from 'native-base';
import { baseHeaderStyle } from '../../styles/variables';

// components
import ChapterList from '../../components/ChapterList';
import Loader from '../../components/common/Loader';
import ProfileHeader from '../../components/common/ProfileHeader';

class Chapters extends Component {
  static navigationOptions = () => ({
    title: 'Surahs',
    ...baseHeaderStyle
  });

  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { actions, navigation } = this.props;

    const reciter = navigation.state.params.reciter;
    actions.getChapters();
    actions.loadFilesForReciter(reciter.id);
  }

  render() {
    const { navigation, chapters, actions, search, files, selectedSurah } = this.props;
    const { navigate } = navigation;
    const reciter = navigation.state.params.reciter;

    if (chapters.length < 1 || files.length < 1) return <Loader />;
    return (
      <Container>
        <ProfileHeader name={reciter.name} arabicName={reciter.arabic_name} />
        <ChapterList
          chapters={chapters}
          files={files}
          reciter={reciter}
          actions={{ ...actions, navigate }}
          search={search}
          selectedSurah={selectedSurah}
        />
      </Container>
    );
  }
}

Chapters.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    chapters: state.chapters.chapters,
    files: state.files.files,
    search: state.search,
    selectedSurah: state.player ? state.player.selectedSurah : null
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch), dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapters);
