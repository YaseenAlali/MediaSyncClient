import SoundPlayer from "react-native-sound-player";
import { StreamFileRequest, DownloadFileRequest } from "../API/Requests";
import { DownloadFile } from "../API/FileTransfer";
import { CheckDownloadsFolderExist, SyncDirectoryPath, checkFileExists, createFileHierarchyFromName } from "../FileSystem/FileSystemUtils";
const { PureComponent } = require("react");
const { View, Text, TouchableOpacity } = require("react-native");

export class MediaElement extends PureComponent {
    constructor(props) {
        super(props),
        this.audio = null;
    }
    state = {
        isStreaming: false,
        fileExists : false,
    }

    startPlaying(){}

    stopPlaying(){
        console.log("Stopped");
        this.setState({
            isStreaming : false
        });
        SoundPlayer.stop();
    }

    componentDidMount(){
        checkFileExists(SyncDirectoryPath + this.props.item).then((result) => {
            this.setState({
                fileExists : result
            });
        })
    }

    handleStreamPress(fileName){
        try{
            console.log("PRESSED", this.props)
            StreamFileRequest(fileName).then(async (url) => {
                SoundPlayer.playUrl(url);
                this.setState({
                    isStreaming : true
                })
            });
            this.props.onStreamButtonPress(this.props.item.index)

        }
        catch(error){
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
            <View style={{ height: 50 }}>
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <View style={{ flex: 0.75 }}>
                        <Text numberOfLines={3}>{fileName}</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 0.125, borderColor: this.state.isStreaming ? 'green' : 'white', borderWidth: 1, margin: 5 }} onPress={() => { this.handleStreamPress(item)}}>
                        <Text>Stream</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 0.125, borderColor: this.state.fileExists ? 'green' : 'red', borderWidth: 1, margin: 5 }} onPress={() => {this.handleDownloadPress(item) }}>
                        <Text>Download</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}