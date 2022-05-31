import { CloudinaryImage } from '@cloudinary/url-gen';
import { config } from '../../config';
import cloudinary from './cloudinary';

export function getCloudinaryImage(
  publicId: string,
  prefix: string = config.CLOUDINARY_PREFIX || ''
): CloudinaryImage {
  return cloudinary.image(`${prefix}${publicId}`);
}

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
