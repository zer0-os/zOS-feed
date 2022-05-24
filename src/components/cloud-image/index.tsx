import React, { ImgHTMLAttributes } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { getCloudinaryImage, getHashFromIpfsUrl } from '../../util/image/util';
import { scale } from '@cloudinary/url-gen/actions/resize';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
  cloudinaryTransformable?: (
    cloudinaryImage: CloudinaryImage
  ) => CloudinaryImage;
}

export default class CloudImage extends React.Component<Properties> {
  render() {
    const {
      className,
      src,
      cloudinaryTransformable,
      width,
      ...rest
    } = this.props;
    const hashImage = getHashFromIpfsUrl(src);

    let cloudinaryImage = getCloudinaryImage(hashImage);

    if (width) {
      cloudinaryImage = cloudinaryImage.resize(scale().width(width));
    }

    return (
      <AdvancedImage className={className} cldImg={cloudinaryImage} {...rest} />
    );
  }
}
