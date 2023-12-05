import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class PlayerControl extends React.Component {
  state = {
    isPlaying: false,
    repeatMode: 'playlist'
  };

  getRepeatMode(){
    const repeatMode = this.state.repeatMode;
    return repeatMode;
  }

  togglePlayState(value) {
    this.setState({
      isPlaying: value
    });
  }

  handlePlayPause = () => {
    const { onPlay, onPause } = this.props;
    this.setState(prevState => {
      if (prevState.isPlaying) {
        onPause();
      } else {
        onPlay();
      }
      return { isPlaying: !prevState.isPlaying };
    });
  };

  handleRepeat = () => {
    this.setState(prevState => {
      let nextRepeatMode;

      switch (prevState.repeatMode) {
        case 'playlist':
          nextRepeatMode = 'one';
          break;
        case 'one':
          nextRepeatMode = 'none';
          break;
        default:
          nextRepeatMode = 'playlist';
      }

      return { repeatMode: nextRepeatMode };
    });
  }


  render() {
    const { onNext, onPrev } = this.props;
    const { isPlaying } = this.state;

    return (
      <View style={styles.container}>
        <Icon name="backward" size={30} onPress={onPrev} />
        {isPlaying ?
          (
            <Icon name="pause" size={30} onPress={this.handlePlayPause} />
          )
          :
          (
            <Icon name="play" size={30} onPress={this.handlePlayPause} />
          )
        }
        <Icon name="forward" size={30} onPress={onNext} />
        {this.state.repeatMode === 'playlist' ?
          (
            <Icon name="list" size={20} onPress={this.handleRepeat} />
          )
          : this.state.repeatMode === 'one' ?
            (
              <Icon name="repeat" size={20} onPress={this.handleRepeat} />
            )
            :
            (
              <Icon name="stop" size={20} onPress={this.handleRepeat} />
            )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'purple',
    padding: 10,
    zIndex: 2,
    alignItems: 'center',
  },
});

export default PlayerControl;