import { ListMediaElements } from "../API/Requests";
import { pickDirectory } from 'react-native-document-picker'
const { PureComponent, createRef } = require("react");
const { View, Text, FlatList, TouchableOpacity, ActivityIndicator } = require("react-native");
import { MediaElement } from "../Components/MediaElement";
import { GetStorageRootPath, SyncDirectoryPath, setSyncDirectory } from "../FileSystem/FileSystemUtils";
import PlayerControl from "../Components/PlayerControl";
import { AppContext } from "../Contexts/Contexts";

export class ServerMedia extends PureComponent {
    static contextType = AppContext;
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
        ListMediaElements().then((mediaListRequestResponse) => {
            if (mediaListRequestResponse.length == 0) {
                throw new Error("Request did not return any result");
            }
            const newItems = JSON.parse(mediaListRequestResponse)["AudioFiles"].map((item, index) => ({ index, item }));
            this.context.setServerMediaItems(newItems);
            this.context.setServerMediaFetched(true);
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
        this.context.setOnServerSearchItemPressed(() => this.onSearchItemPressed);
        this.loadItems()
    }


    _onRefresh() {
        this.context.setServerMediaFetched(false);
        this.context.setServerMediaItems([]);
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

    onNext() {
        const count = this.context.ServerMediaItems.length;
        const index = this.context.ServerTrackIndex + 1 >= count ? 0 : this.context.ServerTrackIndex + 1;
        const cell = this.cellRefs[index];
        if (cell) {
            this.listRef.scrollToIndex({ index: index, animated: true });
            setTimeout(() => {
                cell?.playVideo();
            }, 100);
        }
    }
    onPrev() {
        const count = this.context.ServerMediaItems.length;
        const index = this.context.ServerTrackIndex - 1 < 0 ? count - 1 : this.context.ServerTrackIndex - 1;
        const cell = this.cellRefs[index];
        this.listRef.scrollToIndex({ index: index, animated: true });
        setTimeout(() => {
            cell?.playVideo();
        }, 100)
    }


    render() {
        if (!this.context.ServerMediaFetched) {
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
                {(this.context.ClientTrackIndex != -1 || this.context.ServerTrackIndex != -1) &&
                    <PlayerControl
                        ref={(ref) => { this.PlayerControlRef = ref }}
                        onNext={this.onNext}
                        onPrev={this.onPrev}
                        serverPlayerControl={true}
                    ></PlayerControl>
                }
                <FlatList
                    ref={(ref) => { this.listRef = ref }}
                    renderItem={({ item }) => this._renderItem({ item })}
                    data={this.context.ServerMediaItems}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={(data, index) => (
                        { length: 50, offset: 50 * index, index }
                    )}
                    // windowSize={10}
                    // initialNumToRender={3}
                    // maxToRenderPerBatch={10}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                ></FlatList>
            </View>
        )
    }
}