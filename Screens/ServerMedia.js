import { ListMediaElements } from "../API/Requests";

const { PureComponent } = require("react");
const { View, Text, FlatList, TouchableOpacity } = require("react-native");
import { MediaElement } from "../Components/MediaElement";

export class ServerMedia extends PureComponent {
    state = {
        MediaElementsFetched: false,
        items: []
    }

    componentDidMount() {
        ListMediaElements().then((mediaListRequestResponse) => {
            if (mediaListRequestResponse.length == 0) {
                throw new Error("Request did not return any result");
            }
            const newItems = JSON.parse(mediaListRequestResponse)["AudioFiles"]
            this.setState({
                MediaElementsFetched: true,
                items: newItems
            })
            console.log(this.state.items.length)
        }).catch((error) => {
            {
                console.warn(error)
            }
        })
    }

    _renderItem({ item }) {
        return(
            <MediaElement item={item}></MediaElement>
        )
    }
    render() {
        if (!this.state.MediaElementsFetched) {
            return (
                <View>
                    <Text>Not loaded</Text>
                </View>
            )
        }
        return (
            
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <FlatList
                    renderItem={({ item }) => this._renderItem({ item })}
                    data={this.state.items}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={(data, index) => (
                        { length: 50, offset: 50 * index, index }
                    )}
                    windowSize={50}
                    initialNumToRender={3}
                    maxToRenderPerBatch={50}

                ></FlatList>
            </View>
        )
    }
}