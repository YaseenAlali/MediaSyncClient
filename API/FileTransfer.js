import RNFetchBlob from 'rn-fetch-blob';
import { SyncDirectoryPath, createFileHierarchyFromName } from '../FileSystem/FileSystemUtils';
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

async function DownloadFile(url, path, name = '') {
  let filePath = path + name;
  try {
    await createFileHierarchyFromName(filePath);
    try {
      const response = await RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        connectionTimeout : 120000,
        readTimeout : 120000,
        backgroundTimeout : 120000
      }).promise;
      return response.statusCode == 200;
    } catch (downloadError) {
      console.warn(downloadError, "error in download file");
      return false;
    }
  } catch (createError) {
    console.warn(createError, "error in creating file hierarchy");
    return false;
  }
}





async function UploadFile(url, path, file) {
  try {
    let result = await RNFetchBlob.fetch("POST", url, {
      'Content-Type': 'multipart/form-data'
    }, [
      { name: 'file', data: file },
      {
        name: 'fileToUpload',
        filename: file,
        data: RNFetchBlob.wrap(path.replace('file://', ""))
      },
    ]);
    return result.respInfo.status == 201;
  } catch (error) {
    console.warn(error);
    return false;
  }
}



export { DownloadFile, UploadFile }