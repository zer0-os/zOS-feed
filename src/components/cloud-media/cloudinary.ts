import { Cloudinary } from '@cloudinary/url-gen';
import { config } from '../../config';

const cloudinaryInstance = new Cloudinary({
  cloud: {
    cloudName: config.CLOUDINARY_NAME,
  },
});

export default cloudinaryInstance;
