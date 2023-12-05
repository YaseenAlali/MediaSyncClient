import { ListMediaElements } from "../API/Requests";
import { pickDirectory } from 'react-native-document-picker'
const { PureComponent, createRef } = require("react");
const { View, Text, FlatList, TouchableOpacity, ActivityIndicator } = require("react-native");
import { MediaElement } from "../Components/MediaElement";
import { GetStorageRootPath, SyncDirectoryPath, setSyncDirectory } from "../FileSystem/FileSystemUtils";
import PlayerControl from "../Components/PlayerControl";
import SoundPlayer from "react-native-sound-player";

export class ServerMedia extends PureComponent {
    state = {
        MediaElementsFetched: false,
        items: [],
        refreshing: false,
    }

    constructor(props) {
        super(props);
        this.StreamingItem = createRef();
        this._onStreamButtonPress = this._onStreamButtonPress.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.GetIsItemBeingPlayed = this.GetIsItemBeingPlayed.bind(this);
        this.getRepeatModeMode = this.getRepeatModeMode.bind(this);
        this.onMediaFinishedPlaying = this.onMediaFinishedPlaying.bind(this);
        this.cellRefs = {};
        this.PlayerControlRef = null;
        this.listRef = null;
    }

    _onStreamButtonPress(itemIndex) {
        if (this.StreamingItem.current != null) {
            if (this.StreamingItem.current != itemIndex) {
                const cell = this.cellRefs[this.StreamingItem.current];
                if (cell) {
                    cell.stopPlaying()
                }
            }
        }
        this.PlayerControlRef.togglePlayState(true);
        this.StreamingItem.current = itemIndex;
        console.log(this.StreamingItem.current)
    }

    loadItems() {
        ListMediaElements().then((mediaListRequestResponse) => {
            if (mediaListRequestResponse.length == 0) {
                throw new Error("Request did not return any result");
            }
            const newItems = JSON.parse(mediaListRequestResponse)["AudioFiles"].map((item, index) => ({ index, item }));
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

    onMediaFinishedPlaying() {
        const repeatMode = this.getRepeatModeMode();
        const itemIndex = this.StreamingItem.current;
        switch (repeatMode) {
            case 'playlist':
                this.onNext();
                break;
            case 'one':
                console.log("Repeat");
                this.cellRefs[itemIndex].playVideo();
                break;
            default:
                console.log("None do nothing")
                this.cellRefs[itemIndex].stopPlaying();
                this.PlayerControlRef.togglePlayState(false);
        }
    }

    getRepeatModeMode() {
        if (this.PlayerControlRef) {
            return this.PlayerControlRef.getRepeatMode();
        }
        return 'none';
    }

    componentDidMount() {
        this.loadItems()
    }

    _onRefresh() {
        this.setState({
            MediaElementsFetched: false,
            items: []
        });
        this.loadItems();
    }

    _renderItem({ item }) {
        return (
            <MediaElement
                item={item}
                onStreamButtonPress={this._onStreamButtonPress}
                ref={(ref) => {
                    this.cellRefs[item.index] = ref;
                }}
                GetIsItemBeingPlayed={this.GetIsItemBeingPlayed}
                onMediaFinishedPlaying={this.onMediaFinishedPlaying}
            >
            </MediaElement>
        )
    }

    GetIsItemBeingPlayed(index) {
        if (this.StreamingItem.current != null) {
            return index == this.StreamingItem.current;
        }
        return false;
    }

    handleDirectoryPicketButtonPress() {
        pickDirectory().then((result) => {
            if (result) {
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

    onPlay() {
        SoundPlayer.resume();
    }
    onPause() {
        SoundPlayer.pause()
    }
    onNext() {
        const count = this.state.items.length;
        if (this.StreamingItem.current != null) {
            const itemIndex = this.StreamingItem.current + 1;
            if (itemIndex != count){
                this.cellRefs[itemIndex].playVideo();
            }
        }
    }
    onPrev() {
        const count = this.state.items.length;
        const currentIndex = this.StreamingItem.current;
        if (this.StreamingItem.current != null) {
            if (currentIndex != 0){
                this.cellRefs[currentIndex - 1].playVideo();
            }
        }
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
                    <View style={{ position: 'relative', left: 0, top: 10, backgroundColor: 'red', width: 50, height: 50, margin: 10 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleDirectoryPicketButtonPress() }}></TouchableOpacity>
                    </View>
                }
                <PlayerControl
                    ref={(ref) => { this.PlayerControlRef = ref }}
                    onNext={this.onNext}
                    onPause={this.onPause}
                    onPlay={this.onPlay}
                    onPrev={this.onPrev}
                ></PlayerControl>
                <FlatList
                    ref={(ref) => { this.listRef = ref}}
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