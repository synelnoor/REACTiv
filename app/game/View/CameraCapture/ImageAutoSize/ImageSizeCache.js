import { Image } from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const cache = new Map();

const getImageSizeFromCache = (image) => {
  if (typeof image === 'number') {
    return cache.get(image);
  } else {
    return cache.get(image.uri);
  }
};

const loadImageSize = (image) => {
  return new Promise((resolve, reject) => {
    if (typeof image === 'number') {
      const { width, height } = resolveAssetSource(image);
      resolve({ width, height });
    } else {
      Image.getSize(
        image.uri,
        (width, height) => {
          resolve({ width, height });
        },
        reject
      );
    }
  });
};

export const getImageSizeFitWidthFromCache = (image, toWidth) => {
  const size = getImageSizeFromCache(image);
  if (size) {
    const { width, height } = size;
    return { width: toWidth, height: toWidth * height / width };
  }
  return {};
};

const getImageSizeMaybeFromCache = async (image) => {
  let size = getImageSizeFromCache(image);
  if (!size) {
    size = await loadImageSize(image);
    cache.set(image, size);
  }
  return size;
};

export const getImageSizeFitWidth = async (image, toWidth) => {
  const { width, height } = await getImageSizeMaybeFromCache(image);
  return { width: toWidth, height: toWidth * height / width };
};
