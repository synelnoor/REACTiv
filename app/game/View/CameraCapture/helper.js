import { Accelerometer } from "react-native-sensors";
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import { Image, Platform } from 'react-native';
import moment from 'moment';
import Marker from 'react-native-image-marker';
import RNFetchBlob from 'rn-fetch-blob';

const DirectoryImageSave = 'IndonesiaKaya2';
const dm = [1748, 2480];
const frameServer = 'https://www.indonesiakaya.com/assets/frames/';

export const p = Platform.OS === 'android' ? 'file://' : '';
export const dirPictures = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}`;
export const tmpDir = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/tmp`;
export const tmpFrame = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/frame`;
export const imageRoot = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images`;
export const imageOriginal = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images/originals`;
export const imageResult = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images/results`;

export const getAccelerometer = async () => {
  try {
    const observable = await new Accelerometer({ updateInterval: 200 });
    return observable;
  } catch (err) {
    return false;
  }
}

export const moveImage = async (path, dest) => {
  const moved = await RNFS.moveFile(path, dest);
  return moved;
}

// Get Actual Image
export const getImageSize = (img) => {
  return new Promise(resolve => {
    Image.getSize(img, (width, height) => {
      resolve ({
        width, height
      });
    });
  });
}

export const resizeFrame = async (source, frame) => {
  const { width, height } = await getImageSize(source);
  // const newFrameName = `${moment().format('YYYYMMDDhhmmss')}.png`;
 
  RNFFmpeg.disableLogs();
  await RNFFmpeg.execute(`-i ${p}${tmpFrame}/${frame} -vf scale=${width}:${height} ${p}${tmpDir}/cached-${frame}`);
  return `${p}${tmpDir}/cached-${frame}`;
}

export const overlay2Image = async (source, frameName) => {
  let frFlie = `${p}${tmpDir}/cached-${frameName}`;
  const exists = await RNFS.exists(frFlie);

  if (!exists) {
    frFlie =  await resizeFrame(source, frameName);
  }

  const markPath = await Marker.markImage({
    src: source, 
    markerSrc: frFlie, 
    X: 0,
    Y: 0,
    scale: 1, 
    markerScale: 1, 
    quality: 100
  });

  return `${p}${markPath}`;

  // const overlayImage = `${p}${imageResult}/framed-${moment().format('YYYYMMDDhhmmss')}.JPEG`;
  // await moveImage(`${p}${markPath}`, overlayImage);
  // return overlayImage;
}

export const combineImageCached = async (source, frameName, cachedFileName) => {
  const tmpCachedName = `${p}${tmpDir}/${cachedFileName}`;
  const exists = await RNFS.exists(tmpCachedName);

  if (!exists) {
    const markPath = await overlay2Image(source, frameName);
    await moveImage(`${p}${markPath}`, tmpCachedName);
  }
  return tmpCachedName;
}

export const saveAndRotate = async (x, file) => {
  let resizeImage = null;
  let orientation = 'portrait';

  if (x > 6) {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri,
      dm[1],
      dm[0],
      'JPEG',
      80,
      270,
      imageOriginal
    );

    orientation = 'landscape';
  }
  else if (x < -6) {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri,
      dm[1],
      dm[0],
      'JPEG',
      80,
      90,
      imageOriginal
    );
    
    orientation = 'landscape';
  }
  else {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri,
      dm[1],
      dm[0],
      'JPEG',
      80,
      0,
      imageOriginal
    );
    orientation = 'portrait';
  }

  return {
    ...resizeImage,
    orientation
  };
}

export const getLastImageOriginal = async() => {
  const dir = await RNFS.readDir(imageOriginal);
  if (dir.length > 0) {
    return dir.slice(-1).pop();
  }

  return {};
}

export const createStorageDir = async () => {
  const mainDir = await RNFS.mkdir(dirPictures);
  console.log('MAIN', mainDir);
  await RNFS.mkdir(imageRoot);
  await RNFS.mkdir(imageOriginal);
  await RNFS.mkdir(imageResult);
  await RNFS.mkdir(tmpFrame);
  await RNFS.mkdir(tmpDir);
  
  return true;
}

export const getAllFrame = async() => {
  const dir = await RNFS.readDir(tmpFrame);
  return dir;
}

export const chkFrameDownload = async () => {
  try {
    console.log('download Frame')
    const res = await fetch(`${frameServer}/list.json`);
    const data = await res.json()
    
    if (data.length > 0) {
      data.map(obj => {
        let keys = Object.keys(obj);
        for(var i = 0; i < keys.length; i++) {
          let key = keys[i];
          
          let frFile = `${p}${tmpFrame}/${obj[key]}`;
          RNFS.exists(frFile).then(exists => {
            if (!exists) {
              RNFetchBlob.fetch('GET', `${frameServer}${obj[key]}`)
              .then((res) => {
                let status = res.info().status;
                
                if(status == 200) {
                  RNFetchBlob.fs.writeFile(`${tmpFrame}/${obj[key]}`, res.base64(), 'base64')
                } else {
                  console.log('failed download');
                }
              });
            }
          })
        }
        
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const uniqArray = (a) => {
  var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return a.filter(function(item) {
      var type = typeof item;
      if(type in prims)
          return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
      else
          return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}
