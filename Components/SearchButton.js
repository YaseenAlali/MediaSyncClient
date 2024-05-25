import React from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList } from 'react-native';
import { MediaContext} from '../Contexts/Contexts';
import MediaProviders from '../Providers/MediaProviders';

class SearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {
      isSearchActive: false,
      searchText: '',
      results: [],
    };
    this.searchingServer = this.props.searchingServer;
    this.constructor.contextType = MediaContext;
  }


  handleSearch = (ServerMediaItems) => {
    if (this.state.searchText.length != 0) {
      const results = ServerMediaItems.filter(item => item.item.toLowerCase().includes(this.state.searchText.toLowerCase()));
      this.setState({ results });
    }
  }

  handlePress = (item) => {
    console.log("pressed")
    if (this.searchingServer)
      this.context.onServerSearchItemPressed(item);
    else
      this.context.onClientSearchItemPressed(item);
  }

  render() {
    if (this.searchingServer) //<=temp
      return (
        <MediaProviders>
          <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.state.isSearchActive && (
                <TextInput
                  style={{ height: 40, borderColor: 'purple', borderWidth: 1, marginRight: 10, color: 'purple' }}
                  onChangeText={text => {
                    this.setState({ searchText: text });
                    this.handleSearch(this.context.ServerMediaItems);
                  }}
                  maxLength={15}
                  value={this.state.searchText}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isSearchActive: true });
                }}
                style={{
                  backgroundColor: 'purple',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  paddingHorizontal: 20,
                  borderRadius: 10
                }}
              >
                <Text style={{ color: 'white' }}>Search</Text>
              </TouchableOpacity>
              {this.state.isSearchActive && (
                <TouchableOpacity
                  onPress={() => this.setState({ isSearchActive: false, searchText: '', results: [] })}
                  style={{
                    backgroundColor: 'purple',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    marginLeft: 10
                  }}
                >
                  <Text style={{ color: 'white' }}>Discard</Text>
                </TouchableOpacity>
              )}
            </View>
            {this.state.isSearchActive && (
              <View style={{ position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'white', zIndex: 1, opacity: 0.8 }}>
                <FlatList
                  data={this.state.results}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => this.handlePress(item)}>
                      <Text style={{ color: 'black' }}>{item.item} - {item.index}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </MediaProviders>
      );

    return (
      <MediaProviders>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.state.isSearchActive && (
              <TextInput
                style={{ height: 40, borderColor: 'purple', borderWidth: 1, marginRight: 10, color: 'purple' }}
                onChangeText={text => {
                  this.setState({ searchText: text });
                  this.handleSearch(this.context.ClientMediaItems);
                }}
                maxLength={15}
                value={this.state.searchText}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                this.setState({ isSearchActive: true });
              }}
              style={{
                backgroundColor: 'purple',
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                paddingHorizontal: 20,
                borderRadius: 10
              }}
            >
              <Text style={{ color: 'white' }}>Search</Text>
            </TouchableOpacity>
            {this.state.isSearchActive && (
              <TouchableOpacity
                onPress={() => this.setState({ isSearchActive: false, searchText: '', results: [] })}
                style={{
                  backgroundColor: 'purple',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginLeft: 10
                }}
              >
                <Text style={{ color: 'white' }}>Discard</Text>
              </TouchableOpacity>
            )}
          </View>
          {this.state.isSearchActive && (
            <View style={{ position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'white', zIndex: 1, opacity: 0.8 }}>
              <FlatList
                data={this.state.results}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this.handlePress(item)}>
                    <Text style={{ color: 'black' }}>{item.item} - {item.index}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      </MediaProviders>
    );
  }
}

export default SearchButton;
