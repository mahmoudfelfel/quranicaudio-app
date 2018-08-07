import React, { Component } from 'react';
import { Text, View, Dimensions, Platform } from 'react-native';
import * as Actions from '../../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Video from 'react-native-video';
import Styles from '../../styles';
import * as Utils from "../../utils/audio"; //eslint-disable-line
import TrackPlayer from 'react-native-track-player';

import {
  ForwardButton,
  BackwardButton,
  PlayButton,
  ShuffleButton,
  VolumeButton,
  SongSlider
} from '../../components/PlayerButtons';
import MusicPlayer from '../../utils/MusicPlayer';
import * as Progress from "react-native-progress"; //eslint-disable-line
const { width } = Dimensions.get('window');

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    const songs = props.chapters.chapters;

    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      sliding: false,
      currentTime: 0,
      songIndex: props.chapters.selected_chapter - 1,
      songs
    };
  }

  songImage = '';

  async componentDidMount() {
    // configure the Track player
    await this.initTrackPlayer();
    // Set songs for the global state
    this.props.actions.setSongsList(this.state.songs);
    this.props.actions.setSelectedSongIndex(this.state.songIndex);
    // initialize the player
    const currentItem = this.state.songs[this.state.songIndex];
    this.initPlayer({ items: this.state.songs, currentItem });

    // to handle background/foreground switching
    // AppState.addEventListener('change', this._handleAppStateChange);


    // MusicPlayer.onPlay(() => {
    //   this.setState({ playing: true });
    // });

    // MusicPlayer.onPause(() => {
    //   this.setState({ playing: false });
    // });

    // MusicPlayer.onForward(this.goForward);

    // MusicPlayer.onBackward(this.goBackward);

    // // Set songs for the global state
    // this.props.actions.setSongsList(this.state.songs);
    // this.props.actions.setSelectedSongIndex(this.state.songIndex);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      songIndex: nextProps.chapters.selected_chapter - 1
    });
  }

  initTrackPlayer = async () => {
    // init the player
    await TrackPlayer.setupPlayer();
    // Configuring the player
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_PLAY_FROM_ID,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      stopWithApp: false,
    });
    return true;
  }

  initPlayer = async (items, currentItem) => {
    // pause the previous item (if any)
    TrackPlayer.pause();

    // convert the items to tracks
    const tracks = Utils.itemsToTracks(items);

    // push all the items to the player
    await TrackPlayer.add(tracks);

    // skip to the current track, then play it
    await TrackPlayer.skip(currentItem.id);
    TrackPlayer.play();
    this.setState({ playing: true });
  }

  // eslint-disable-next-line
  onLoad = (params) => {
    this.setState({ songDuration: params.duration });
    this.setPlayingSong();
  }

  setPlayingSong = () => {
    const song = this.state.songs[this.state.songIndex];

    MusicPlayer.setNowPlaying({
      title: song.title,
      artwork: song.thumb,
      artist: song.artist,
      duration: song.songDuration
    });
  }

  setTime = (params) => {
    if (!this.state.sliding) {
      this.setState({ currentTime: params.currentTime });
    }
  }

  randomSongIndex = () => {
    const maxIndex = this.state.songs.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0; //eslint-disable-line
  }

  toggleShuffle = () => {
    this.setState({ shuffle: !this.state.shuffle });
  }

  toggleVolume = () => {
    this.setState({ muted: !this.state.muted });
  }

  togglePlay = () => {
    this.setState({ playing: !this.state.playing });
  }

  handleSlidingStart = () => {
    this.setState({ sliding: true });
  }

  handleSlidingChange = (value) => {
    const newPosition = value * this.state.songDuration;
    this.setState({ currentTime: newPosition });
  }

  handleSlidingComplete = () => {
    this.refs.audio.seek(this.state.currentTime); //eslint-disable-line
    this.setState({ sliding: false });
  }

  goForward = () => {
    if (
      this.state.shuffle ||
      this.state.songIndex + 1 !== this.state.songs.length
    ) {
      this.setState({
        songIndex: this.props.shuffle
          ? this.randomSongIndex()
          : this.props.songIndex + 1,
        currentTime: 0,
        playing: true
      });
      this.refs.audio.seek(0); //eslint-disable-line

      this.props.actions.setSelectedSongIndex(this.state.songIndex + 1);
    }
  }

  goBackward = () => {
    if (this.state.currentTime < 3 && this.state.songIndex !== 0) {
      this.setState({
        songIndex: this.state.songIndex - 1,
        currentTime: 0
      });

      this.props.actions.setSelectedSongIndex(this.state.songIndex - 1);
    } else {
      this.refs.audio.seek(0); //eslint-disable-line
      this.setState({
        currentTime: 0
      });
    }
  }

  onEnd = () => {
    this.setState({ playing: false });
    this.setState({ playing: true });
  }

  renderVideoPlayer = () => {
    if (this.state.songs[this.state.songIndex]) {
      return (
        <Video
          source={{ uri: this.state.songs[this.state.songIndex].path }}
          volume={this.state.muted ? 0 : 1.0}
          muted={false}
          ref="audio"
          paused={!this.state.playing}
          playInBackground
          playWhenInactive
          onLoad={this.onLoad}
          onProgress={this.setTime}
          onEnd={this.onEnd}
          resizeMode="cover"
          repeat={false}
        />
      );
    }
    return null;
  }

  renderProgressBar = () => {
    if (this.state.searchedSongs) {
      const song = this.state.songs[this.state.songIndex];
      return (
        <Progress.Bar
          progress={this.state.progreses[song.id]}
          width={width}
          color="#fff"
          borderColor="transparent"
        />
      );
    }
    return null;
  }

  render() {
    let songPercentage;
    if (this.state.songDuration !== undefined) {
      songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
      songPercentage = 0;
    }

    const title =
      this.state.songs &&
      this.state.songs[this.state.songIndex] &&
      this.state.songs[this.state.songIndex].title;
    const minimised = this.props.minimise;
    return (
      <View style={Styles.container}>
        {minimised && Platform.OS === 'ios' &&
        <PlayButton
          togglePlay={this.togglePlay}
          playing={this.state.playing}
          minimised={minimised}
        />}
        {this.renderVideoPlayer()}
        {this.renderProgressBar()}
        <Text style={Styles.songTitle}>
          {title}
        </Text>
        <Text style={Styles.albumTitle}>
          {this.props.chapters.reciter}
        </Text>

        <View style={Styles.controls}>
          <ShuffleButton
            shuffle={this.state.shuffle}
            toggleShuffle={this.toggleShuffle}
            disabled={this.props.search}
          />
          <BackwardButton goBackward={this.goBackward} />
          <PlayButton
            togglePlay={this.togglePlay}
            playing={this.state.playing}
          />
          <ForwardButton
            songs={this.props.songs}
            shuffle={this.state.shuffle}
            songIndex={this.props.songIndex}
            goForward={this.goForward}
            disabled={this.props.search}
          />
          <VolumeButton
            muted={this.state.muted}
            toggleVolume={this.toggleVolume}
          />
        </View>
        <SongSlider
          handleSlidingStart={this.handleSlidingStart}
          handleSlidingComplete={this.handleSlidingComplete}
          onChange={this.handleSlidingChange}
          value={songPercentage}
          songDuration={this.state.songDuration}
          currentTime={this.state.currentTime}
        />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(Actions, dispatch), dispatch };
}

function mapStateToProps(store) {
  return {
    songs: store.songs.songs,
    songIndex: store.songs.songIndex,
    searchResults: store.searchResults,
    progreses: store.progreses
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
