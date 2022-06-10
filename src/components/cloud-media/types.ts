import { CloudinaryVideo, CloudinaryImage } from '@cloudinary/url-gen';

export interface CloudinaryMedia {
  media: CloudinaryImage | CloudinaryVideo;
  type: MediaType;
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
  Unknown = 'unknown',
}
