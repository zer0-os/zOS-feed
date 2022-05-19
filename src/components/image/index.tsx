import React, { ImgHTMLAttributes } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { getCloudinaryImage, getHashFromIpfsUrl } from '../../util/image/util';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
  useCloudinary?: boolean;
  cloudinaryTransformable?: (
    cloudinaryImage: CloudinaryImage
  ) => CloudinaryImage;
}

export default class Image extends React.Component<Properties> {
  renderCloudinaryImage = (): React.ReactElement => {
    const { className, src, cloudinaryTransformable, ...rest } = this.props;
    const hashImage = getHashFromIpfsUrl(src);

    let cloudinaryImage = getCloudinaryImage(hashImage);

    if (typeof cloudinaryTransformable === 'function') {
      cloudinaryImage = cloudinaryTransformable(cloudinaryImage);
    }

    return (
      <AdvancedImage className={className} cldImg={cloudinaryImage} {...rest} />
    );
  };

  render() {
    const { useCloudinary, ...rest } = this.props;

    if (useCloudinary) {
      return this.renderCloudinaryImage();
    }

    return <img {...rest} />;
  }
}
