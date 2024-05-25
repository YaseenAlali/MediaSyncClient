import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppContext } from '../Contexts/Contexts';

class PlayerControl extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    repeatMode: 'playlist'
  };

  static contextType = AppContext;


  getRepeatMode(){
    const repeatMode = this.state.repeatMode;
    return repeatMode;
  }

  handlePlayPause = () => {
    const {IsPlaying, setIsPlaying} = this.context;
    setIsPlaying(!IsPlaying);
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
    const { IsPlaying } = this.context;

    return (
      <View style={styles.container}>
        <Icon name="backward" size={30} onPress={onPrev} />
        {IsPlaying ?
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