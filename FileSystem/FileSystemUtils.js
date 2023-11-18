var RNFS = require('react-native-fs')
import { PermissionsAndroid, Platform, } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


var SyncDirectoryPath = '';



/**
 * Sets the sync directory path for file synchronization.
 *
 * @function setSyncDirectory
 * @param {string} [path=''] - The path to the sync directory.
 * @returns {void}
 */
function setSyncDirectory(path = '') {
    try {
        SyncDirectoryPath = path;
    }
    catch (error) {
        console.warn(error);
    }
}

/**
 * Asynchronous function to save the sync directory path to AsyncStorage.
 *
 * @async
 * @function saveSyncDirectoryAsyncStorage
 * @param {string} [pathValue=''] - The path value to be saved.
 * @returns {Promise<void>}
 */
async function saveSyncDirectoryAsyncStorage(pathValue = '') {
    try {
        await AsyncStorage.setItem('SyncDir', pathValue);
    }
    catch (error) {
        console.warn(error)
    }
}


/**
 * Asynchronous function to retrieve the sync directory path from AsyncStorage.
 *
 * @async
 * @function getSyncDirectoryAsyncStorage
 * @returns {Promise<string>} A Promise that resolves to the sync directory path retrieved from AsyncStorage, or an empty string if not found.
 */
async function getSyncDirectoryAsyncStorage() {
    try {
        let value = await AsyncStorage.getItem('SyncDir');
        return value || "";
    }
    catch (error) {
        console.warn(error);
        return "";
    }
}


/**
 * Get the cache folder path based on the platform.
 *
 * On Android, it returns the external cache directory path.
 * On other platforms, it returns the regular cache directory path.
 *
 * @returns {string} The cache folder path.
 */
function GetCacheFolderPath() {
    if (Platform.OS == "android") return RNFS.ExternalCachesDirectoryPath;
    return RNFS.CachesDirectoryPath;
}

/**
 * Create a folder with the specified path.
 * @async
 * @param {string} path - The path of the folder to create.
 */
async function CreateDownloadsFolder(path = "MediaSync") {
    try {
        await RNFS.mkdir(path);
    } catch (error) {
        console.warn(error);
    }
}

/**
 * Create a folder with the specified path if it doesn't exist already.
 * @async
 * @param {string} path - The path of the folder to create if it doesn't exist.
 */
async function CreateDownloadsFolderIfDoesntExist(path = "MediaSync") {
    try {
        let dirExists = await RNFS.exists(path);
        if (dirExists) {
            console.log("Directory already exists");
        } else {
            await CreateDownloadsFolder(path);
        }
    } catch (error) {
        console.warn(error);
    }
}

/**
 * Read the contents of a directory and return an array of files within it.
 * @async
 * @param {string} directoryPath - The path to the directory to read.
 * @returns {Promise<Array<Object>} An array of file objects.
 */
async function readDirectory(directoryPath) {
    try {
        const files = (await RNFS.readDir(directoryPath)).filter(element => element.isFile());
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

/**
 * Read the contents of a directory and return an array of audio files.
 * @async
 * @param {string} directoryPath - The path to the directory to read.
 * @returns {Promise<Array<Object>} An array of audio file objects.
 */
async function readAudioFiles(directoryPath) {
    try {
        const audioFileExtensions = ['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.flac', '.opus'];
        const files = await readDirectory(directoryPath);
        const audioFiles = files.filter((file) => {
            const fileName = file.name;
            return audioFileExtensions.some((ext) => fileName.endsWith(ext));
        });
        return audioFiles;
    } catch (error) {
        console.warn(error);
        return [];
    }
}

/**
 * Asynchronous function to request storage permissions on Android using PermissionsAndroid.
 *
 * @async
 * @function askForStoragePermissions
 * @returns {Promise<boolean>} A Promise that resolves to a boolean value indicating whether both read and write permissions are granted.
 */
async function askForStoragePermissions() {
    try {
        const permissions = await PermissionsAndroid.requestMultiple([
            'android.permission.WRITE_EXTERNAL_STORAGE',
            'android.permission.READ_EXTERNAL_STORAGE'
        ]);

        const readPermissionGranted = permissions['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
        const writePermissionGranted = permissions['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
        console.log(`Read: ${readPermissionGranted} Write: ${writePermissionGranted}`);
        return readPermissionGranted && writePermissionGranted;
    } catch (error) {
        console.warn("Error requesting storage permissions:", error);
    }
}



/**
 * Asynchronous function to check storage permissions on Android using PermissionsAndroid.
 *
 * @async
 * @function checkStoragePermissions
 * @returns {Promise<boolean>} A Promise that resolves to a boolean value indicating whether both read and write permissions are granted.
 */
async function checkStoragePermissions() {
    const readPermission = await PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE')
    const writePermission = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE');
    console.log(`Read: ${readPermission} Write: ${writePermission}`);
    return readPermission && writePermission;
}




export {
    GetCacheFolderPath, CreateDownloadsFolder, CreateDownloadsFolderIfDoesntExist, readAudioFiles,
    readDirectory, checkStoragePermissions, askForStoragePermissions, setSyncDirectory, getSyncDirectoryAsyncStorage, 
    saveSyncDirectoryAsyncStorage

}