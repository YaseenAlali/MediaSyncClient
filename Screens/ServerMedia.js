import { ListMediaElements } from "../API/Requests";
import {pickDirectory} from 'react-native-document-picker'
const { PureComponent } = require("react");
const { View, Text, FlatList, TouchableOpacity } = require("react-native");
import { MediaElement } from "../Components/MediaElement";
import { GetStorageRootPath, SyncDirectoryPath, setSyncDirectory } from "../FileSystem/FileSystemUtils";

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

    handleDirectoryPicketButtonPress(){
        pickDirectory().then((result) => {
            if (result){
                let magic = decodeURIComponent(result.uri);
                console.log(magic)
                if (magic.startsWith('content://')) {
                const uriComponents = magic.split(':');
                const fileNameAndExtension = uriComponents[uriComponents.length - 1];
                const destPath = `${GetStorageRootPath()}/${fileNameAndExtension}`;
                console.log(destPath)
                setSyncDirectory(destPath);
                console.log(SyncDirectoryPath)
                }
            }
        }).catch((error) => {
            console.warn(error);
        })
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
                {false &&
                <View style={{position : 'relative', left : 0, top : 10, backgroundColor : 'red', width : 50, height : 50, margin : 10}}>
                    <TouchableOpacity style={{flex : 1}} onPress={() => {this.handleDirectoryPicketButtonPress()}}></TouchableOpacity>
                </View>
                }
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