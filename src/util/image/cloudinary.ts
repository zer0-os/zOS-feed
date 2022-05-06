import { Cloudinary } from "@cloudinary/url-gen";
import { config } from "../../config";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: config.CLOUDINARY_NAME,
  },
});

export default cloudinary;
