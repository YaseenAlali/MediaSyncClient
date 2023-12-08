import SoundPlayer from "react-native-sound-player";
import { StreamFileRequest, DownloadFileRequest } from "../API/Requests";
import { DownloadFile } from "../API/FileTransfer";
import { CheckDownloadsFolderExist, SyncDirectoryPath, checkFileExists, createFileHierarchyFromName } from "../FileSystem/FileSystemUtils";
const { PureComponent } = require("react");
const { View, Text, TouchableOpacity } = require("react-native");
import Icon from 'react-native-vector-icons/FontAwesome';


export class MediaElement extends PureComponent {
    constructor(props) {
        super(props),
            this.audio = null;
    }
    state = {
        isStreaming: this.props.GetIsItemBeingPlayed(this.props.item.index),
        fileExists: false,
    }

    startPlaying() { }

    stopPlaying() {
        console.log("Stopped", this.props.item.index);
        this.setState({
            isStreaming: false
        });
        this.removeSub();
        console.log(this.audio)
    }

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
            this.removeSub();
            const item = this.props.item.item;
            StreamFileRequest(item).then(async (url) => {
                SoundPlayer.playUrl(url);
                console.log(url);
                this.setState({
                    isStreaming: true
                })
                this.props.onStreamButtonPress(this.props.item.index);
                this.audio = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
                    console.log('finished playing', success, this.props.item.index);
                    this.props.onMediaFinishedPlaying();
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

    handleDownloadPress(fileName) {
        try {
            url = DownloadFileRequest(fileName);
            console.log(url)
            console.log(SyncDirectoryPath);
            CheckDownloadsFolderExist().then((res) => console.log(res))
            // createFileHierarchyFromName(SyncDirectoryPath)
            DownloadFile(url, SyncDirectoryPath, fileName);

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
            <View style={{ height: 50, borderColor: 'purple', borderWidth: 1, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 0.95 }}>
                        <Text numberOfLines={3}>{fileName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon color={this.state.isStreaming ? 'green' : 'white'} name='play' size={30} onPress={() => this.handleStreamPress()} style={{ marginRight: 10 }}></Icon>
                        <Icon color={this.state.fileExists ? 'green' : 'red'} name='download' size={30} onPress={() => this.handleDownloadPress()} style={{ marginRight: 10 }}></Icon>
                    </View>
                </View>
            </View>

        )
    }
}