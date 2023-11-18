import RNFetchBlob from 'rn-fetch-blob';
import { createFileHierarchyFromName } from '../FileSystem/FileSystemUtils';
var RNFS = require('react-native-fs')


/**
 * Downloads a file from the given URL and saves it to the specified path
 * @async
 * @function DownloadFile
 * @param {string} url - The URL of the file to be downloaded.
 * @param {string} path - The local path where the downloaded file should be saved.
 * @returns {Promise<boolean>} A Promise that resolves when the file is successfully downloaded and saved.
 */
async function DownloadFileTwo(url, path) {
  try {
    const response = await RNFetchBlob.config({
      fileCache: true,
      path: path,
    }).fetch('GET', url);



    if (response.info().status === 200) {
      console.log('File downloaded successfully.');
      return true;
    } else {
      throw new Error(`Failed to download file. Status code: ${response.info().status}`);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

function DownloadFile(url, path, name = '') {

  let filePath = path + name;
  console.log(filePath)
  createFileHierarchyFromName(filePath).then(() => {
    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise.then((r) => {
      console.log(r.statusCode)
    });
  })
}




async function UploadFile(url, path) { }



export { DownloadFile }