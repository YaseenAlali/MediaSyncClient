import { StreamFileRequest, DownloadFileRequest } from "../API/Requests";
import { DownloadFile } from "../API/FileTransfer";
import { CheckDownloadsFolderExist, SyncDirectoryPath, checkFileExists, createFileHierarchyFromName } from "../FileSystem/FileSystemUtils";
const { PureComponent } = require("react");
const { View, Text, TouchableOpacity } = require("react-native");
import Icon from 'react-native-vector-icons/FontAwesome';
import TrackPlayer, { Event } from "react-native-track-player";
import { AppContext } from "../Contexts/Contexts";


export class MediaElement extends PureComponent {
    constructor(props) {
        super(props)
    }
    state = {
        fileExists: false,
    }


    static contextType = AppContext


    removeSub() {
        if (this.audio && this.audio.remove) {
            this.audio.remove();
        }
    }

    componentDidMount() {
        checkFileExists(SyncDirectoryPath + this.props.item.item).then((result) => {
            this.setState({
                fileExists: result
            });
        })
    }


    playVideo() {
        try {
            const item = this.props.item.item;
            StreamFileRequest(item).then(async (url) => {
                TrackPlayer.reset().then(() => {
                    TrackPlayer.add({
                        url: url
                    })

                    TrackPlayer.play();
                    this.context.setIsPlaying(true);
                    this.context.setServerTrackIndex(this.props.item.index);
                })
            });

        }
        catch (error) {
            console.warn(error)
        }
    }

    handleStreamPress() {
        try {
            this.playVideo();
        }
        catch (error) {
            console.warn(error)
        }
    }

    handleDownloadPress() {
        try {
            const item = this.props.item
            url = DownloadFileRequest(item.item);
            CheckDownloadsFolderExist().then((res) => console.log(res))
            DownloadFile(url, SyncDirectoryPath, item.item).then((res) => {
                this.setState({
                    fileExists: res
                })
            })

        }
        catch (error) {
            console.warn(error)
        }
    }

    render() {
        const item = this.props.item.item;
        // console.log(item)
        const itemSeperated = item.split('/')
        const fileName = itemSeperated[itemSeperated.length - 1];
        const catogry = itemSeperated[1]
        return (
            <View style={{ height: 50, borderColor: 'purple', borderWidth: 1, marginBottom: 5, borderRadius: 25 }}>
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 0.95 }}>
                        <Text style={{ marginLeft: 10 }} numberOfLines={3}>{fileName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon color={this.context.ServerTrackIndex == this.props.item.index ? 'green' : 'white'} name='play' size={30} onPress={() => this.handleStreamPress()} style={{ marginRight: 10 }}></Icon>
                        <Icon color={this.state.fileExists ? 'green' : 'red'} name='download' size={30} onPress={() => this.handleDownloadPress()} style={{ marginRight: 10 }}></Icon>
                    </View>
                </View>
            </View>

        )
    }
}