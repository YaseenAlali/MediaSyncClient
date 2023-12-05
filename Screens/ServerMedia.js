import { ListMediaElements } from "../API/Requests";
import {pickDirectory} from 'react-native-document-picker'
const { PureComponent, createRef } = require("react");
const { View, Text, FlatList, TouchableOpacity, ActivityIndicator } = require("react-native");
import { MediaElement } from "../Components/MediaElement";
import { GetStorageRootPath, SyncDirectoryPath, setSyncDirectory } from "../FileSystem/FileSystemUtils";

export class ServerMedia extends PureComponent {
    state = {
        MediaElementsFetched: false,
        items: [],
        refreshing : false,
    }

    constructor(props){
        super(props);
        this.StreamingItem = createRef();
        this._onStreamButtonPress = this._onStreamButtonPress.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.cellRefs = {}
    }

    _onStreamButtonPress(itemIndex){
        if (this.StreamingItem.current){
            this.cellRefs[this.StreamingItem.current].stopPlaying()
        }
        this.StreamingItem.current = itemIndex;
        console.log(this.StreamingItem.current)
    }

    loadItems(){
        ListMediaElements().then((mediaListRequestResponse) => {
            if (mediaListRequestResponse.length == 0) {
                throw new Error("Request did not return any result");
            }
            const newItems = JSON.parse(mediaListRequestResponse)["AudioFiles"].map((item, index) => ({index, item}));
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

    componentDidMount() {
        this.loadItems()
    }

    _onRefresh(){
        this.setState({
            MediaElementsFetched : false,
            items : []
        });
        this.loadItems();
    }

    _renderItem({ item }) {
        return(
            <MediaElement
             item={item}
             onStreamButtonPress={this._onStreamButtonPress}
             ref={(ref) => {
                this.cellRefs[item.index] = ref;
              }}
             >
             </MediaElement>
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
                    <ActivityIndicator size={40} color={'purple'}></ActivityIndicator>
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
                    windowSize={10}
                    initialNumToRender={3}
                    maxToRenderPerBatch={10}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                ></FlatList>
            </View>
        )
    }
}