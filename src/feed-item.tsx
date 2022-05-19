import React from 'react';
import { Link } from 'react-router-dom';
import { metadataService, ZnsMetadataService } from '@zer0-os/zos-zns';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { CloudinaryImage } from '@cloudinary/url-gen';
import Image from './components/image';

import './styles.css';

export interface Model {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  znsRoute: string;
  metadataUrl?: string;
}

export interface Properties extends Model {
  app: string;
  metadataService?: ZnsMetadataService;
}

interface State extends Model {}

export class FeedItem extends React.Component<Properties, State> {
  constructor(props) {
    super(props);

    const { app, metadataService, ...model } = props;

    this.state = {
      ...model,
    };
  }

  static defaultProps = {
    metadataService: metadataService,
  };

  componentDidMount = async () => {
    const { metadataUrl, metadataService } = this.props;

    if (metadataUrl) {
      const metadata = await metadataService.load(metadataUrl);

      this.setState((previousState) => ({ ...previousState, ...metadata }));
    }
  };

  render() {
    const { title, description, imageUrl, znsRoute } = this.state;
    const { app } = this.props;

    return (
      <div className='feed-item'>
        <Link to={`/${[znsRoute, app].join('/')}`}>
          <div className='feed-item__text-content'>
            <h3 className='feed-item__title'>{title}</h3>
            <span className='feed-item__description'>{description}</span>
          </div>
          <Image
            useCloudinary
            cloudinaryTransformable={(cloudinaryImage: CloudinaryImage) =>
              cloudinaryImage.resize(scale().width(480))
            }
            className='feed-item__image'
            src={imageUrl}
            alt={title}
          />
        </Link>
      </div>
    );
  }
}
