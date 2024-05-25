import { UploadFileRequest } from "../API/Requests";
import { UploadFile } from "../API/FileTransfer";
import Icon from 'react-native-vector-icons/FontAwesome';
import TrackPlayer from "react-native-track-player";
import { AppContext } from "../Contexts/Contexts";
const { PureComponent } = require("react");
const { View, Text, TouchableOpacity } = require("react-native");


export class LocalMediaElement extends PureComponent {
    constructor(props) {
        super(props)
    }
    state = {
        fileExists: this.props.item.itemExists,
    }
    static contextType = AppContext;






    playVideo() {
        try {
            TrackPlayer.reset().then(() => {
                TrackPlayer.add({
                    url: this.props.item.item
                })

                TrackPlayer.play();
                this.context.setIsPlaying(true);
                this.context.setClientTrackIndex(this.props.item.index);
            })
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

    handleUploadPress() {
        const url = UploadFileRequest();

        UploadFile(url, this.props.item.item, this.props.item.nameWithCatogry).then((res) => {
            this.setState({
                fileExists: res
            });
        })
    }

    render() {
        const item = this.props.item.item;
        const itemSeperated = item.split('/')
        const fileName = itemSeperated[itemSeperated.length - 1];
        const catogry = itemSeperated[1];
        return (
            <View style={{ height: 50, borderColor: 'purple', borderWidth: 1, marginBottom: 5, borderRadius: 25 }}>
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 0.95 }}>
                        <Text style={{ marginLeft: 10 }} numberOfLines={3}>{fileName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon color={this.context.ClientTrackIndex == this.props.item.index ? 'green' : 'white'} name='play' size={30} onPress={() => this.handleStreamPress()} style={{ marginRight: 10 }}></Icon>
                        <Icon color={this.state.fileExists ? 'green' : 'red'} name='upload' size={30} onPress={() => this.handleUploadPress()} style={{ marginRight: 10 }}></Icon>
                    </View>
                </View>
            </View>

        )
    }
}

