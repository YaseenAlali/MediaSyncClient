var RNFS = require('react-native-fs')
import { Platform } from 'react-native'


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
 *
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
 *
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
 *
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
 *
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


export {
    GetCacheFolderPath, CreateDownloadsFolder, CreateDownloadsFolderIfDoesntExist, readAudioFiles,
    readDirectory
}