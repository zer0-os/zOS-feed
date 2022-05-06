import { Cloudinary } from '@cloudinary/url-gen';
import { config } from '../../config';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: config.CLOUDINARY_NAME ? config.CLOUDINARY_NAME : 'fact0ry-dev',
  },
});

export default cloudinary;
