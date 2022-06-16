import { CloudinaryFile } from '@cloudinary/url-gen';
import { MediaType, CloudinaryMedia } from './types';
import { config } from './../../config';
import cloudinaryInstance from './cloudinary';

export const getCloudMedia = (
  publicId: string,
  prefix = config.CLOUDINARY_PREFIX
): Promise<CloudinaryMedia> => {
  const cloudinaryFile = new CloudinaryFile(`${prefix}${publicId}`, {
    ...cloudinaryInstance.getConfig().cloud,
  });
  cloudinaryFile.setAssetType('video');

  return getMediaType(cloudinaryFile.toURL()).then((mediaType) => {
    if (mediaType === MediaType.Image) {
      return {
        media: cloudinaryInstance.image(`${prefix}${publicId}`),
        type: MediaType.Image,
      };
    } else {
      return {
        media: cloudinaryInstance.video(`${prefix}${publicId}`),
        type: MediaType.Video,
      };
    }
  });
};

const getMediaType = (cloudinaryUrl: string): Promise<MediaType> =>
  new Promise((resolve) => {
    var xhttp = new XMLHttpRequest();
    xhttp.open('HEAD', cloudinaryUrl);
    xhttp.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        const mimeType = this.getResponseHeader('Content-Type');
        if (mimeType?.includes('image')) {
          resolve(MediaType.Image);
        } else if (mimeType?.includes('video')) {
          resolve(MediaType.Video);
        }
        resolve(MediaType.Unknown);
      }
    };
    xhttp.send();
  });

/**
 * Pulls the IPFS hash from an IPFS url
 * @param url IPFS url to get hash from
 * @returns IPFS hash from url
 */
export const getHashFromIpfsUrl = (url: string): string => {
  const regex = /Qm(\w{44})[/\w]*/;

  if (regex.test(url)) {
    const matches = url.match(regex) as string[];
    return matches[0];
  }

  return '';
};
