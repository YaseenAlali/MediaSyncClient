import RNFetchBlob from "rn-fetch-blob";
var RNFS = require('react-native-fs');

const ServerAddress = "http://192.168.1.79:5000/";
const Requests={
    stream : "stream",
    upload : "upload",
    download : "download",
    list : "list",
    cleanup : "cleanup"
}
async function ListMediaElements(){
    try{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      let requestResult = await fetch(ServerAddress + Requests.list, requestOptions);
      if (requestResult.ok){
        let response = await requestResult.text();
        return response;
      }
      return "";
    }
    catch(error){
        console.warn(error);
        return "";
    }
}

async function StreamFileRequest(fileName){
      const url = `${ServerAddress}${Requests.stream}?file=${fileName}`;
      return url;
}

function DownloadFileRequest(fileName){
    const url = `${ServerAddress}${Requests.download}?file=${fileName}`;
    return url;
}




export {ServerAddress, ListMediaElements, StreamFileRequest, DownloadFileRequest}