import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

class SearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSearchActive: false, searchText: '' };
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        {this.state.isSearchActive && (
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10, color : 'black'}}
            onChangeText={text => this.setState({ searchText: text })} maxLength={15}
            value={this.state.searchText}
          />
        )}
        <TouchableOpacity 
          onPress={() => this.setState({ isSearchActive: !this.state.isSearchActive })}
          style={{ 
            backgroundColor: '#00cc00', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 40, 
            paddingHorizontal: 20,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
        {this.state.isSearchActive && (
          <TouchableOpacity 
            onPress={() => this.setState({ isSearchActive: false, searchText: '' })}
            style={{ 
              backgroundColor: 'red', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: 40, 
              paddingHorizontal: 20,
              borderRadius: 5,
              marginLeft: 10
            }}
          >
            <Text style={{ color: 'white' }}>Discard</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default SearchButton;
