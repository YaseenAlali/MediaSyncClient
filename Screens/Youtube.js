import { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { DownloadFile } from "../API/FileTransfer";
import { SyncDirectoryPath } from "../FileSystem/FileSystemUtils";
import { DownloadFromYoutubeRequest } from "../API/Requests";

export const Youtube = ({ navigation }) => {

    const [searchText, setSearchText] = useState('');
    const [downloadText, setdownloadText] = useState('');
    const [downloadName, setdownloadName] = useState();
    const onDownloadYoutubeButtonClicked = () => {
        if (downloadText === '') {
            Alert.alert('Error', 'Please enter youtube link');
            return;
        }

        if (downloadName === '') {
            Alert.alert('Error', 'Please enter download name');
            return;
        }

        const url = DownloadFromYoutubeRequest(downloadText);
        DownloadFile(url, SyncDirectoryPath, "/" + downloadName + ".opus").then((res) => {
            res ? Alert.alert('Success', 'Downloaded successfully') : Alert.alert('Error', 'Failed to download');
        });
    }
    
    const renderDownloadYoutubeComponent = () => {
        return (
            <View style={{ borderWidth: 1, borderColor: 'purple', borderRadius: 25, marginTop: 25 }}>
            <Text style={{ margin: 10, color: 'purple' }}>Youtube download</Text>
            <TextInput cursorColor={'purple'}
                value={downloadText}
                onChangeText={text => setdownloadText(text)}
                style={{ borderRadius: 25, borderWidth: 1, borderColor: 'purple', color: 'purple', margin : 10 }}
                placeholderTextColor={'purple'}
                placeholder="Youtube link">
            </TextInput>
            <TextInput cursorColor={'purple'}
                value={downloadName}
                onChangeText={text => setdownloadName(text)}
                style={{ borderRadius: 25, borderWidth: 1, borderColor: 'purple', color: 'purple', margin : 10 }}
                placeholderTextColor={'purple'}
                placeholder="Downlaod name">
            </TextInput>
            <TouchableOpacity
                onPress={onDownloadYoutubeButtonClicked}>
                <View style={{
                    backgroundColor: 'purple', alignItems: 'center',
                    justifyContent: 'center', height: 40, paddingHorizontal: 20, borderRadius: 10, margin: 10
                }}>
                    <Text>Download</Text>
                </View>
            </TouchableOpacity>
        </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {renderDownloadYoutubeComponent()}
        </View>
    )
}