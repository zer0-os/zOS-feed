import React, { ImgHTMLAttributes } from 'react';
import classNames from 'classnames';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fillPad, pad, scale } from '@cloudinary/url-gen/actions/resize';
import { getCloudinaryImage, getHashFromIpfsUrl } from '../../util/image/util';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { auto } from '@cloudinary/url-gen/qualifiers/background';
import cloudinary from '../../util/image/cloudinary';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
}

interface State {
  isLoaded: boolean;
}

export default class CloudImage extends React.Component<Properties, State> {
  state = { isLoaded: false };

  onLoad = (): void => {
    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true,
      });
    }
  };

  onError = (): void => {
    if (!this.state.isLoaded) {
      this.setState({
        isLoaded: true,
      });
    }
  };

  cloudinaryImage = (): CloudinaryImage => {
    const { src, width, height } = this.props;

    const hashImage = getHashFromIpfsUrl(src);

    if (hashImage) {
      const cloudinaryImage = getCloudinaryImage(hashImage);

      return cloudinaryImage.resize(
        pad().width(width).height(height).background(auto())
      );
    } else {
      return cloudinary
        .image(src)
        .resize(pad().width(width).height(height).background(auto()))
        .setDeliveryType('fetch');
    }
  };

  render() {
    const { className, src, ...rest } = this.props;

    if (!src) {
      return null;
    }

    const cloudinaryImage = this.cloudinaryImage();

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
