import React, { ImgHTMLAttributes } from 'react';
import classNames from 'classnames';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { getCloudinaryImage, getHashFromIpfsUrl } from '../../util/image/util';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
  cloudinaryTransformable?: (
    cloudinaryImage: CloudinaryImage
  ) => CloudinaryImage;
}

interface State {
  isLoaded: boolean;
}

export default class CloudImage extends React.Component<Properties, State> {
  state = { isLoaded: false };

  onLoad = () => {
    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true,
      });
    }
  };

  onError = () => {
    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true,
      });
    }
  };

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
      <AdvancedImage
        className={classNames(className, { spinner: !this.state.isLoaded })}
        cldImg={cloudinaryImage}
        onLoad={this.onLoad}
        onError={this.onError}
        {...rest}
      />
    );
  }
}
