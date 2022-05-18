import React, { ImgHTMLAttributes } from 'react';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { getCloudinaryImage, getHashFromIpfsUrl } from '../../util/image/util';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
  useCloudinary?: boolean;
}

export default class Image extends React.Component<Properties> {
  renderCloudinaryImage = (): React.ReactElement => {
    const { className, src, ...rest } = this.props;
    const hashImage = getHashFromIpfsUrl(src);
    
    return (
      <AdvancedImage
        className={className}
        cldImg={getCloudinaryImage(hashImage)}
        plugins={[lazyload(), placeholder({ mode: 'blur' })]}
        {...rest}
      />
    );
  }

  render() {
    const { useCloudinary, ...rest } = this.props;

    if (useCloudinary) {
      return this.renderCloudinaryImage();
    }

    return <img {...rest} />;
  }
}
