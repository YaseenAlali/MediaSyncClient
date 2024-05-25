import { ListMediaElements } from "../API/Requests";
import { pickDirectory } from 'react-native-document-picker'
const { PureComponent, createRef } = require("react");
const { View, Text, FlatList, TouchableOpacity, ActivityIndicator } = require("react-native");
import { MediaElement } from "../Components/MediaElement";
import { GetStorageRootPath, ListFilesRecursive, SyncDirectoryPath, setSyncDirectory } from "../FileSystem/FileSystemUtils";
import PlayerControl from "../Components/PlayerControl";
import SoundPlayer from "react-native-sound-player";
import {MediaContext } from "../Contexts/Contexts";
import { LocalMediaElement } from "../Components/LocalMediaElement";

export class ClientMedia extends PureComponent {
    static contextType = MediaContext;
    state = {
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
        this.onSearchItemPressed = this.onSearchItemPressed.bind(this);
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
        ListFilesRecursive(SyncDirectoryPath).then((result) => {
            const newItems = result.map((item, index) => ({ 
                index,
                item : item.path,
                name : item.name, 
                nameWithCatogry: item.nameWithCatogry,
                itemExists : this.context.ServerMediaItems.find(x => x.item == "/" + item.nameWithCatogry) != null
            }));
            this.context.setClientMediaItems(newItems);
            this.context.setClientMediaFetched(true);
        }).catch((error) => {
            console.warn(error);
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
                const cell = this.cellRefs[itemIndex];
                if (cell) {
                    cell.stopPlaying();
                }
                this.PlayerControlRef.togglePlayState(false);
        }
    }

    getRepeatModeMode() {
        if (this.PlayerControlRef) {
            return this.PlayerControlRef.getRepeatMode();
        }
        return 'none';
    }

    onSearchItemPressed(item) {
        if (item) {
            this.listRef.scrollToIndex({
                index: item.index,
                animated: true
            });
        }
    }

    componentDidMount() {
        this.context.setOnClientSearchItemPressed(() => this.onSearchItemPressed);
        this.loadItems()
    }


    _onRefresh() {
        this.context.setClientMediaFetched(false);
        this.context.setClientMediaItems([]);
        this.loadItems();
    }

    _renderItem({ item }) {
        return (
            <LocalMediaElement
                item={item}
                ref={(ref) => { this.cellRefs[item.index] = ref; }}
                onSearchItemPressed={this.onSearchItemPressed}
                GetIsItemBeingPlayed={this.GetIsItemBeingPlayed}
                onMediaFinishedPlaying={this.onMediaFinishedPlaying}
                onStreamButtonPress={this._onStreamButtonPress}

            ></LocalMediaElement>
            // <MediaElement
            //     item={item}
            //     onStreamButtonPress={this._onStreamButtonPress}
            //     ref={(ref) => {
            //         this.cellRefs[item.index] = ref;
            //     }}
            //     GetIsItemBeingPlayed={this.GetIsItemBeingPlayed}
            //     onMediaFinishedPlaying={this.onMediaFinishedPlaying}
            // >
            // </MediaElement>
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
        const count = this.context.ClientMediaItems.length;
        if (this.StreamingItem.current != null) {
            const itemIndex = this.StreamingItem.current + 1;
            if (itemIndex != count) {
                this.cellRefs[itemIndex].playVideo();
            }
        }
    }
    onPrev() {
        const currentIndex = this.StreamingItem.current;
        if (this.StreamingItem.current != null) {
            if (currentIndex != 0) {
                this.cellRefs[currentIndex - 1].playVideo();
            }
        }
    }


    render() {
        if (!this.context.ClientMediaFetched) {
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
                    ref={(ref) => { this.listRef = ref }}
                    renderItem={({ item }) => this._renderItem({ item })}
                    data={this.context.ClientMediaItems}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={(data, index) => (
                        { length: 50, offset: 50 * index, index }
                    )}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                ></FlatList>
            </View>
        )
    }
}