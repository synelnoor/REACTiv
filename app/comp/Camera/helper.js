import { Accelerometer } from "react-native-sensors";
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import { Image, Platform } from 'react-native';
import moment from 'moment';
import Marker from 'react-native-image-marker';
import RNFetchBlob from 'rn-fetch-blob';
import RNThumbnail from 'react-native-thumbnail';

const DirectoryImageSave = 'IndonesiaKaya4';
const dm = [1748, 2480];
const frameServer = 'https://www.indonesiakaya.com/assets/frames/';

export const p = Platform.OS === 'android' ? 'file://' : '';
export const dirPictures = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}`;
export const tmpDir = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/tmp`;
export const tmpFrame = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/frame`;
export const imageRoot = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images`;
export const videoRoot = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/videos`;
export const imageOriginal = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images/originals`;
export const imageResult = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/images/results`;
export const videoOriginal = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/videos/originals`;
export const videoResult = `${RNFS.ExternalStorageDirectoryPath}/${DirectoryImageSave}/videos/results`;
export const imageGallery = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/`;

export const getAccelerometer = async () => {
  try {
    const observable = await new Accelerometer({ updateInterval: 200 });
    return observable;
  } catch (err) {
    return false;
  }
}

export const sleep = t => new Promise(resolve => setTimeout(resolve, t));

export const moveMediaFile = async (path, dest) => {
  const moved = await RNFS.moveFile(path, dest);
  return moved;
}

export const removeMediaFile = async (path) => {
  const moved = await RNFS.unlink(path);
  return moved;
}

export const copyMediaFile = async (path, dest) => {
  const moved = await RNFS.copyFile(path, dest);
  return moved;
}

export const orientationCheck = (x) => {
  let or = {
    orientation: null,
    position: null
  };

  if (x > 6) {
    or.orientation = 'landscape';
    or.position = 'left';
  }
  else if (x < -6) {
    or.orientation = 'landscape';
    or.position = 'right';
  }
  else {
    or.orientation = 'portrait';
    or.position = 'top';
  }

  return or;
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

export function gcd(a,b) {if(b>a) {temp = a; a = b; b = temp} while(b!=0) {m=a%b; a=b; b=m;} return a;}
export function ratio(x,y) {c=gcd(x,y); return ""+(x/c)+":"+(y/c)}
export const autoHeightByRatio = (ratioString, width) => {
  const splitRatio = ratioString.split(':');

  const rat1 = splitRatio[0];
  const rat2 = splitRatio[1];

  const ratio  = width / rat1;
  const height = ratio * rat2;

  return { width, height: width * height / width };
}

export const resizeFrame = async (type, frame, width, height) => {
  const fn = `${p}${tmpDir}/cached-${type}-${frame}`;
  const exists = await RNFS.exists(fn);

  if (!exists) {
    RNFFmpeg.disableLogs();
    await RNFFmpeg.execute(`-i ${p}${tmpFrame}/${frame} -vf scale=${width}:${height} ${fn}`);
  }

  return fn;
}

export const getImageFromVideo = async (orientation, source) => {
  const videoImageName = `video-${moment().format('YYYYMMDDhhmmss')}`;
  // RNFFmpeg.disableLogs();
  // await RNFFmpeg.execute(`-i ${source} -ss 00:00:01.000 -vframes 1 ${p}${tmpDir}/${videImageName}`);

  // return `${p}${tmpDir}/${videImageName}`;

  const thumb = await RNThumbnail.get(source);
  console.log('THUMB', thumb);
  const wh = {
    uri: thumb.path,
    width: thumb.width,
    height: thumb.height
  }
  // const n = await saveAndRotate(x, thumb);
  const n = await rotateImage(orientation, wh, 'video')
  wh.uri = n;
  // Copy Object
  let rim = JSON.parse(JSON.stringify(n));
  // console.log('HHHH', n);
  // await moveMediaFile(n.uri, `${p}${imageOriginal}/${videoImageName}.JPEG`);

  // resizeImage.uri = `${p}${imageOriginal}/${videoImageName}.JPEG`;
  // resizeImage.name = videoImageName;
  
  const spl = n.split('/');
  
  const fullName = spl.slice(-1).pop();
  const fileName = fullName.split('.')[0];
  wh.name = fileName;

  console.log('WHWHWHWHWH', wh);

  return { ...wh };
}

export const overlay2Image = async (source, frame, facing) => {
  const splitSourceString = (source).split("/");
  const sourceName = splitSourceString.pop();
  const sourceSplit = sourceName.split('-');
  const width = sourceSplit[2];
  const height = sourceSplit[3].split('.')[0];

  const splitString = (frame).split("/");
  const frameName = splitString.pop();
  const orientation = frameName.split('-')[1];

  console.log('SSSSSSSSSSS', facing);
  const nn = `${moment().format('YYYYMMDDhhmmss')}.jpg`;

    const sourceNewFile = `${p}${imageResult}/overlay-image-${nn}`;

  const sz = await getImageSize(source);

  if (facing) {

    // let valMarkerScale = 0;

    // if (orientation == 'landscape' && facing === 'front') {
    //   valMarkerScale = 1.29;
    // }
    // else if (orientation == 'landscape' && facing === 'back') {
    //   valMarkerScale = 2;
    // }
    // else if (orientation == 'portrait' && facing === 'front') {
    //   valMarkerScale = 2;
    // }
    // else if (orientation == 'portrait' && facing === 'back') {
    //   valMarkerScale = 3.12;
    // }

    const resized = await resizeFrame('image', frameName, sz.width, sz.height)
    await RNFFmpeg.execute(`-i ${source} -i ${resized} -q:v 1 -filter_complex [0:v][1:v]overlay=0:0 -pix_fmt yuv420p -c:a copy ${sourceNewFile}`)
    removeMediaFile(resized);
    // const markPath = await Marker.markImage({
    //   src: source, 
    //   markerSrc: resized, 
    //   X: 0,
    //   Y: 0,
    //   scale: 1, 
    //   markerScale: valMarkerScale, // orientation === 'landscape' ? 1 : 2, 
    //   quality: 100
    // });
    // landscape
    // Kamera depan = 1.29
    // Kamera Belakang = 2

    // portrait
    // Kamera Depan = 2,
    // Kamera Belakang = 3.12

    // await moveMediaFile(`${p}${markPath}`, sourceNewFile);
    // const saved = saveAndRotateByOrientation(orientation, sourceNewFile);
    
    return sourceNewFile;
  }
}

const logCallback = (logData) => {
  console.log(logData.log);
};

export const overlay2Video = async (source, frame, w, h) => {
  const splitSourceString = (source).split("/");
  const sourceName = splitSourceString.pop();

  const splitString = (frame).split("/");
  const frameName = splitString.pop();

  const nn = `${moment().format('YYYYMMDDhhmmss')}.mp4`;

  const sourceNewFile = `${p}${imageResult}/overlay-video-${nn}`;

  // const sourceNewFile = `${p}${imageResult}/overlay-video-${sourceName}`;
  const resized = await resizeFrame('video', frameName, w, h)
  
  RNFFmpeg.disableLogs();
  await RNFFmpeg.execute(`-i ${source} -i ${resized} -q:v 1 -filter_complex [0:v][1:v]overlay=0:0 -pix_fmt yuv420p -c:a copy ${sourceNewFile}`)
  console.log('F VID', source, frame);
  removeMediaFile(resized);
  return sourceNewFile;
  
}

export const combineImageCached = async (source, frameName, cachedFileName) => {
  const tmpCachedName = `${p}${tmpDir}/${cachedFileName}`;
  const exists = await RNFS.exists(tmpCachedName);

  if (!exists) {
    const markPath = await overlay2Image(source, frameName);
    await moveMediaFile(`${p}${markPath}`, tmpCachedName);
  }
  return tmpCachedName;
}

export const combineVideoFrame = async (source, frame) => {
  const videoName = `${moment().format('YYYYMMDDhhmmss')}.mp4`;
  await RNFFmpeg.execute(`-i ${source} -i ${frame} -filter_complex "[0:v][1:v] overlay=0:0:enable='between(t,0,20)'" -pix_fmt yuv420p -preset ultrafast -c:a copy ${p}${videoResult}/${videoName}`);
}

export const saveAndRotateByOrientation = async (orientation, file) => {
  if (orientation === 'landscape') {
    resizeImage = await ImageResizer.createResizedImage(
      file,
      dm[1],
      dm[0],
      'JPEG',
      100,
      270,
      imageResult
    );
  } else {
    resizeImage = await ImageResizer.createResizedImage(
      file,
      dm[1],
      dm[0],
      'JPEG',
      100,
      0,
      imageResult
    );
  }

  return {
    ...resizeImage,
    orientation
  };
}

export const saveAndRotate = async (x, file, newFileName = '') => {
  let resizeImage = null;
  let orientation = 'portrait';

  if (x > 6) {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri ? file.uri : file.path,
      dm[1],
      dm[0],
      'JPEG',
      80,
      270,
      imageOriginal + newFileName
    );

    orientation = 'landscape';
  }
  else if (x < -6) {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri ? file.uri : file.path,
      dm[1],
      dm[0],
      'JPEG',
      80,
      90,
      imageOriginal + newFileName
    );
    
    orientation = 'landscape';
  }
  else {
    resizeImage = await ImageResizer.createResizedImage(
      file.uri ? file.uri : file.path,
      dm[1],
      dm[0],
      'JPEG',
      80,
      0,
      imageOriginal + newFileName
    );
    orientation = 'portrait';
  }

  return {
    ...resizeImage,
    orientation
  };
}

export const saveVideo = async (x, source, newFileName = '', wh, w, h) => {
  let orientation = 'portrait';
  const videoNewName = newFileName === '' ? `${moment().format('YYYYMMDDhhmmss')}.mp4` : `${newFileName}.mp4`;
  
  // await RNFFmpeg.execute(`-i ${source} -q:v 1 -vf hflip -c:a copy ${p}${videoOriginal}/${videoNewName}`);
  // await moveMediaFile(source, `${p}${videoOriginal}/${videoNewName}`);
  
  if (x > 6) {
    await RNFFmpeg.execute(`-i ${source} -metadata:s:v rotate=0 -codec copy ${p}${videoOriginal}/${videoNewName}`);
    orientation = 'landscape';
  }
  // Landscape
  else if (x < -6) {
    await RNFFmpeg.execute(`-i ${source} -metadata:s:v rotate=180 -codec copy ${p}${videoOriginal}/${videoNewName}`);
    orientation = 'landscape';
  }
  else {
    await moveMediaFile(source, `${p}${videoOriginal}/${videoNewName}`);
    orientation = 'portrait';
  }
  
  return {
    uri: `${p}${videoOriginal}/${videoNewName}`,
    orientation
  };
}

export const saveVideoAndRotate = async (x, source, newFileName = '') => {
  let orientation = 'portrait';
  const videoNewName = newFileName === '' ? `${moment().format('YYYYMMDDhhmmss')}.mp4` : `${newFileName}.mp4`;

  RNFFmpeg.disableLogs();
  // Landscape
  if (x > 6) {
    await RNFFmpeg.execute(`-i ${source} -metadata:s:v rotate=0 -codec copy ${p}${videoOriginal}/${videoNewName}`);
    orientation = 'landscape';
  }
  // Landscape
  else if (x < -6) {
    await RNFFmpeg.execute(`-i ${source} -metadata:s:v rotate=180 -codec copy ${p}${videoOriginal}/${videoNewName}`);
    orientation = 'landscape';
  }
  else {
    await moveMediaFile(source, `${p}${videoOriginal}/${videoNewName}`);
    orientation = 'portrait';
  }

  return {
    uri: `${p}${videoOriginal}/${videoNewName}`,
    orientation
  };
}

export const rotateImage = async (oriented, source, tp = 'image') => {
  let newOriginalImageName = `${p}${imageOriginal}/${tp}-${moment().format('YYYYMMDDhhmmss')}`;
  const { orientation, position } = oriented;
  let imgName = null;
  let resizeImage = null;

  if (orientation === 'landscape' && position === 'left') {
    resizeImage = await ImageResizer.createResizedImage(
      source.uri,
      dm[1],
      dm[0],
      'JPEG',
      100,
      270,
      imageOriginal
    );

    const img = await getImageSize(`${p}${resizeImage.path}`);

    imgName = `${newOriginalImageName}-${img.width}-${img.height}.jpg`
    await moveMediaFile(`${p}${resizeImage.path}`, imgName);
  }
  else if (orientation === 'landscape' && position === 'right') {
    resizeImage = await ImageResizer.createResizedImage(
      source.uri,
      dm[1],
      dm[0],
      'JPEG',
      100,
      90,
      imageOriginal
    );

    const img = await getImageSize(`${p}${resizeImage.path}`);

    imgName = `${newOriginalImageName}-${img.width}-${img.height}.jpg`
    await moveMediaFile(`${p}${resizeImage.path}`, imgName);
    
  }
  else {
    resizeImage = await ImageResizer.createResizedImage(
      source.uri,
      dm[1],
      dm[0],
      'JPEG',
      100,
      0,
      imageOriginal
    );

    const img = await getImageSize(`${p}${resizeImage.path}`);

    imgName = `${newOriginalImageName}-${img.width}-${img.height}.jpg`
    await moveMediaFile(`${p}${resizeImage.path}`, imgName);
  }

  return imgName;
}

export const rots = async () => {
  const a = await RNFFmpeg.execute(`-i ${p}${videoRoot}/v1.mp4 -metadata:s:v rotate=0 -codec copy ${p}${videoRoot}/v2.mp4`);
  return a;
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
  await RNFS.mkdir(videoRoot);
  await RNFS.mkdir(imageOriginal);
  await RNFS.mkdir(imageResult);
  await RNFS.mkdir(videoOriginal);
  await RNFS.mkdir(videoResult);
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
    const res = await fetch(`${frameServer}/list.json`);
    const data = await res.json();

    console.log('dataa download', data);
    
    if (data.length > 0) {
      data.map(arr => {  
        let frFile = `${p}${tmpFrame}/${arr}`;
        RNFS.exists(frFile).then(exists => {
          if (!exists) {
            RNFetchBlob.fetch('GET', `${frameServer}${arr}`)
            .then((res) => {
              let status = res.info().status;
              
              if(status == 200) {
                console.log('SUKSES SAVE', `${tmpFrame}/${arr}`)
                RNFetchBlob.fs.writeFile(`${tmpFrame}/${arr}`, res.base64(), 'base64')
              } else {
                console.log('failed download');
              }
            });
          }
        })
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const uniqArray = (a) => {
  const prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return a.filter((item) => {
      const type = typeof item;
      if(type in prims)
          return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
      else
          return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}
