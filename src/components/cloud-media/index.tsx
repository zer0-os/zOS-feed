import React, { ImgHTMLAttributes } from 'react';
import classNames from 'classnames';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { CloudinaryVideo } from '@cloudinary/url-gen';
import { pad } from '@cloudinary/url-gen/actions/resize';
import { auto } from '@cloudinary/url-gen/qualifiers/background';
import { getCloudMedia, getHashFromIpfsUrl } from './utils';
import { CloudinaryMedia, MediaType } from './types';

export interface ComponentProperties
  extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
  getCloudMedia: (
    publicId: string,
    prefix?: string
  ) => Promise<CloudinaryMedia>;
  getHashFromIpfsUrl: (url: string) => string;
}

interface State {
  isLoaded: boolean;
  cloudinaryMedia: CloudinaryMedia;
  isLoading: boolean;
}

export class Component extends React.Component<ComponentProperties, State> {
  state = { isLoaded: false, cloudinaryMedia: null, isLoading: true };

  async componentDidMount() {
    if (this.props.src) {
      await this.fetchMedia();
    }
  }

  async componentDidUpdate(prevProps: ComponentProperties) {
    const { src } = this.props;
    if (src !== prevProps.src) {
      await this.fetchMedia();
    }
  }

  fetchMedia = async (): Promise<void> => {
    const { src, width, height } = this.props;
    const publicId = this.props.getHashFromIpfsUrl(src) || src;

    if (publicId) {
      const { media, type } = await this.props.getCloudMedia(publicId);
      this.setState({
        cloudinaryMedia: {
          media: media?.resize(
            pad().width(width).height(height).background(auto())
          ),
          type,
        },
        isLoading: false,
      });
    } else {
      const { media, type } = await this.props.getCloudMedia(src, '');
      this.setState({
        cloudinaryMedia: {
          media: media?.resize(
            pad().width(width).height(height).background(auto())
          ),
          type,
        },
        isLoading: false,
      });
    }
  };

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

  renderImage = (): React.ReactElement => {
    const { className, src, ...rest } = this.props;
    const { cloudinaryMedia } = this.state;
    return (
      <AdvancedImage
        cldImg={cloudinaryMedia.media}
        onLoad={this.onLoad}
        onError={this.onError}
        {...rest}
      />
    );
  };

  renderVideo = (): React.ReactElement => {
    const { className, src, ...rest } = this.props;
    const { cloudinaryMedia } = this.state;
    return (
      <AdvancedVideo
        cldVid={cloudinaryMedia.media as CloudinaryVideo}
        onLoad={this.onLoad}
        onError={this.onError}
        {...rest}
      />
    );
  };

  renderMedia = (): React.ReactElement => {
    const { cloudinaryMedia } = this.state;

    if (!cloudinaryMedia) {
      return null;
    }

    return (
      <>
        {cloudinaryMedia?.type === MediaType.Image
          ? this.renderImage()
          : this.renderVideo()}
      </>
    );
  };

  render() {
    if (!this.props.src) {
      return null;
    }

    return (
      <div
        className={classNames(this.props.className, {
          spinner: !this.state.isLoaded,
          'cloud-media__wrapper--loading': !this.state.isLoaded,
        })}
      >
        {!this.state.isLoading && this.renderMedia()}
      </div>
    );
  }
}

const CloudImage: React.FC<
  Omit<ComponentProperties, 'getCloudMedia' | 'getHashFromIpfsUrl'>
> = ({ ...props }) => (
  <Component
    {...props}
    getCloudMedia={getCloudMedia}
    getHashFromIpfsUrl={getHashFromIpfsUrl}
  />
);

export default CloudImage;
