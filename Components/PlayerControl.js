import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class PlayerControl extends React.Component {
  state = {
    isPlaying: false,
  };

  togglePlayState(){
    this.setState({
      isPlaying : true
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

  render() {
    const { onNext, onPrev } = this.props;
    const { isPlaying } = this.state;

    return (
      <View style={styles.container}>
        <Icon name="backward" size={30} onPress={onPrev} />
        {isPlaying ? (
          <Icon name="pause" size={30} onPress={this.handlePlayPause} />
        ) : (
          <Icon name="play" size={30} onPress={this.handlePlayPause} />
        )}
        <Icon name="forward" size={30} onPress={onNext} />
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
    zIndex : 2
  },
});

export default PlayerControl;